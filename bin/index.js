#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import App from './src/App.js'

const { argv } = yargs(hideBin(process.argv))

const inputUrl = argv.i || argv.inputUrl || argv._[0]
const outputPath = argv.o || argv.outputPath || argv._[1]

const app = new App(inputUrl, outputPath).run()

// console.log("Convert!")