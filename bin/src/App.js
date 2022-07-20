import { isUri } from 'valid-url'
import { throwErr, InvalidArgsError, FetchError, FileSystemError } from './errors/index.js'
import { DataFetcher } from './DataFetcher.js'
import { Log } from './Log.js'
import { writeFileSync, existsSync } from 'node:fs'
import { normalize, resolve } from 'node:path'
import chalk from 'chalk'
import ora from 'ora'

/** Represent the whole script */
export default class App {

  #dataFetcher = new DataFetcher()
  #inputUrl
  #outputPath
  #originDataset
  #targetDataset
  #logs = []

  /**
   * Creates an App
   * @param {string} inputUrl - The url to fetch MINHA CDN logs
   * @param {string} outputPath - The path to save Agora log
   */
  constructor(inputUrl, outputPath) {
    this.#inputUrl = inputUrl
    this.#outputPath = outputPath
    try {
      this.validateParams()
    } catch (error) {
      throwErr(error)
    }
  }

  /** @returns {string} - The url to fetch MINHA CDN logs */
  get inputUrl() { return this.#inputUrl }

  /** @returns {string} - The path to save Agora log */
  get outputPath() { return this.#outputPath }

  /** @returns {string} - MINHA CDN dataset */
  get originDataset() { return this.#originDataset }

  /** @returns {string} - Agora Dataset */
  get targetDataset() { return this.#targetDataset }

  /** @returns {[Log]} - An array of Log instances */
  get logs() { return this.#logs }

  /** 
   * Validate inputUrl and outputPath - throw an Error if invalid
   * @returns true
   */
  validateParams() {
    if (!this.inputUrl)
      throw new InvalidArgsError('Missing argument "inputUrl"!')
    if (!this.outputPath)
      throw new InvalidArgsError('Missing argument "outputPath"!')
    if (!isUri(this.inputUrl))
      throw new InvalidArgsError(`Invalid arguent "inputUrl" - Expect an Uri, receive: ${this.inputUrl}`)
    if (typeof this.outputPath !== 'string')
      throw new InvalidArgsError(`Invalid argument "outputPath" - Expect a path, receive: ${this.outputPath}`)
    return true
  }

  /**
   * Main function, start the script
   * @param  {booelan} overwriteFile - Overwrite file if it already exists, if false it can generate an error 
   * @returns {App} 
   */
  async run(overwriteFile = false) {
    try {
      console.log(chalk.blue('Running script...'))
      this.#originDataset = await this.fetchData(this.inputUrl)
      const { logs, targetDataset } = this.convertScripts(this.#originDataset)
      this.#logs = logs
      this.#targetDataset = targetDataset
      this.saveConvertedLogFile(this.outputPath, this.targetDataset, overwriteFile)
    } catch (error) {
      throwErr(error)
    }
    return this
  }



  /**
   * Saves Agora log in outputPath 
   * @param  {string} outputPath - Path to save file
   * @param  {string} targetDataset - Log in Agora's format
   * @param  {booelan} overwriteFile - Overwrite file if it already exists, if false it can generate an error 
   * @returns {App} - Self instance
   */
  saveConvertedLogFile(outputPath, targetDataset, overwriteFile = false) {
    const loader = ora().start(`Saving log at ${outputPath}...`)
    outputPath = normalize(outputPath)
    if (existsSync(outputPath)) {
      if (!overwriteFile) {
        loader.fail()
        throw new FileSystemError(`File already exists at ${outputPath} - you can pass the option --overwriteFile (alias -v)`)
      } else {
        loader.warn(`File already exists at ${outputPath} - the old log file will be replaced`)
      }
    }
    try {
      writeFileSync(outputPath, targetDataset)
      loader.succeed(`File saved successfully at ${outputPath}`)
    } catch (error) {
      loader.fail()
      console.log(chalk.red(`${chalk.bold('Output Path:')} ${outputPath}`))
      console.log(chalk.red(`${chalk.bold('Output Content:')}\n ${targetDataset}`))
      throw new FileSystemError(`Impossible to save file at ${resolve(outputPath)}!`)
    }
    return this
  }

  /**
   * Convert OriginDataset (MINHA CDN format) to TargetDataset (Agora Dataset), also generate Logs
   * @param {string} dataset - The Data returned from MINHA CDN url
   * @returns {Object} - An object with "logs" (an array of Agora logs) and a "targetDataset" (a string of parsed logs) 
   */
  convertScripts(dataset) {
    const loader = ora().start('Parsing data...')
    const logs = Log.createLogsSetByMinhaCDN(dataset)
    const targetDataset = Log.generateLogFileAgoraV1_0(logs)
    loader.succeed('Dataset parsed')
    return { logs, targetDataset }
  }

  /**
   * Fetch data from originUrl and parse response data to a text
   * @async
   * @param  {string} inputUrl - A string of url that may be fetched
   * @returns {Promise<string>} - A string of bodyparsed fetched data
   */
  async fetchData(inputUrl) {
    const loader = ora().start(`Fetching data from ${inputUrl}...`)
    let statusCode, body

    try {
      const response = await this.#dataFetcher.fetch(inputUrl)
      statusCode = response.statusCode
      body = response.body
    } catch (error) {
      loader.fail()
      throw new FetchError(`Request to ${inputUrl} failed with code ${error.code}!`)
    }

    try {
      body = await body.text()
      loader.succeed(`Data fetched from ${inputUrl} - status ${statusCode}`)
    } catch (error) {
      loader.fail()
      throw new FetchError(`Data fetched from ${inputUrl}, but was impossible to read body data!`)
    }

    return body
  }

}