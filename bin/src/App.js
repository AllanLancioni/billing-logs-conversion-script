import { isUri } from 'valid-url'
import { throwErr, InvalidArgsError, FetchError } from './errors/index.js'
import chalk from 'chalk'
import ora from 'ora'
import { DataFetcher } from './DataFetcher.js'
import { Log } from './Log.js'


export default class App {

  #dataFetcher = new DataFetcher()
  #inputUrl
  #outputPath
  #originDataset
  #targetDataset
  #logs = []

  constructor(inputUrl, outputPath) {  
    this.#inputUrl = inputUrl
    this.#outputPath = outputPath
    this.#validateParams()
  }

  get inputUrl() {
    return this.#inputUrl
  }
  get outputPath() {
    return this.#outputPath
  }
  get originDataset() {
    return this.#originDataset
  }
  get logs() {
    return this.#logs
  }

  #validateParams() {

    if (!this.inputUrl)
      throwErr(new InvalidArgsError('Missing argument "inputUrl"!'))

    if (!this.outputPath)
      throwErr(new InvalidArgsError('Missing argument "outputUrl"!'))

    if (!isUri(this.inputUrl))
      throwErr(new InvalidArgsError(`Invalid arguent "inputUrl" - Expect an Uri, receive: ${this.inputUrl}`))

    if (typeof this.outputPath !== 'string')
      throwErr(new InvalidArgsError(`Invalid argument "outputUrl" - Expect a path, receive: ${this.outputPath}`))

  }

  async run() {
    console.log(chalk.blue('Running script...'))
    await this.#fetchData()
    this.#convertScripts()

    console.log(this.#targetDataset)
    return this
  }

  #convertScripts() {
    const loader = ora().start('Parsing data...')
    this.#logs = Log.createLogsSetByMinhaCDN(this.originDataset)
    this.#targetDataset = Log.generateLogFileAgoraV1_0(this.#logs)
    loader.succeed('Dataset parsed')

  }

  async #fetchData() {
    const loader = ora().start(`Fetching data from ${this.inputUrl}...`)
    let statusCode, body
    
    try {
      const response = await this.#dataFetcher.fetch(this.inputUrl)
      statusCode = response.statusCode
      body = response.body
    } catch (error) {
      loader.fail()
      throwErr(new FetchError(`Request to ${this.inputUrl} failed with code ${error.code}!`))
    }

    try {
      body = await body.text()
      loader.succeed(`Data fetched from ${this.inputUrl} - status ${statusCode}`)
    } catch (error) {
      loader.fail()
      throwErr(new FetchError(`Data fetched from ${this.inputUrl}, but was impossible to read body data!`))
    }
  
    return this.#originDataset = body
  }
  
}