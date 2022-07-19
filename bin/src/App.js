import { isUri } from 'valid-url'
import { throwErr, InvalidArgsError, FetchError } from './errors/index.js'
import chalk from 'chalk'
import ora from 'ora'
import { DataFetcher } from './DataFetcher.js'


export default class App {

  constructor(inputUrl, outputPath) {  
    this.inputUrl = inputUrl
    this.outputPath = outputPath
    this.#validateParams()
    this.dataFetcher = new DataFetcher()
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

  run() {
    console.log(chalk.blue('Running script...'))
    this.#fetchData()
    return this
  }

  async #fetchData() {
    const loader = ora().start(`Fetching data from ${this.inputUrl}...`)
    let statusCode, body
    
    try {
      const response = await this.dataFetcher.fetch(this.inputUrl)
      statusCode = response.statusCode
      body = response.body
    } catch (error) {
      loader.fail()
      throwErr(new FetchError(`Request to ${this.inputUrl} failed with code ${error.code}!`))
    }

    try {
      body = await body.text()
      loader.succeed(`Data fetched from ${this.inputUrl} (status ${statusCode})!`)
      console.log(body)
    } catch (error) {
      loader.fail()
      throwErr(new FetchError(`Data fetched from ${this.inputUrl}, but was impossible to read body data!`))
    }
  
    this.originData = body

    return this
  }
  
}