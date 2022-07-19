import { isUri } from 'valid-url'
import { throwErr, InvalidArgsError } from './errors/index.js'
import chalk from 'chalk'

import ora from 'ora'


export default class App {

  constructor(inputUrl, outputPath) {  
    this.inputUrl = inputUrl
    this.outputPath = outputPath
    this.#validateParams()
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

    // ora({ text: 'Fetching data...' }).start()

   
    return this
  }
  
}