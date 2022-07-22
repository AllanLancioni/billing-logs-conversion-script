import chalk from "chalk"

const { bold, red, underline } = chalk

export default function throwErr(err, message = err.message) {
  console.log(red(bold(`Script failed with Error: ${underline(err.name || err)}!`), message || ''))
  // process.exit(1)
  throw err
}