import { ParseError, throwErr } from "./errors/index.js"

const TXT_LINE_REGEX = /^(?<responseSize>\d+)\|(?<statusCode>\d{3})\|(?<cacheStatus>[A-Z]+)\|"(?<httpMethod>[A-Z]+) (?<uriPath>[\w/.-]+) (?<protocol>[\w/.]+)"\|(?<timeTaken>[\d.]+)$/

export class Log {

  static createLogsSetByMinhaCDN(txt) {
    if (typeof txt !== 'string')
      throwErr(new ParseError(`Type of "txt" must to be a string, got ${typeof txt}`))
    return txt
      .trim()
      .replace(/\r\n/g, '\n') // Standardize Carriage Return and Line Feed - \r\n to \n
      .split('\n')
      .map((line, index) => this.createLogByMinhaCDNLine(line, index))
  }

  static createLogByMinhaCDNLine(txtLine, lineIndex = 0) {
    const { groups: minhaCDNProps } = TXT_LINE_REGEX.exec(txtLine) || {}
    if (!minhaCDNProps) 
      throwErr(new ParseError(`Line ${lineIndex + 1} missmatch MINHA CDN log pattern - got text: ${txtLine}`))
    return new Log({...minhaCDNProps, provider: 'MINHA CDN'})
  }

  static generateLogFileAgoraV1_0(logs, date = new Date()) {
    if (!Array.isArray(logs) || logs.some(prop => !(prop instanceof Log)))
      throwErr(new Error('Call error generateLogFileAgoraV1_0 - Wrong call signature!'))
    
    let header = ''
    header += '#Version: 1.0\n'
    header += `#Date: ${date.toJSON().substring(0, 19).replace('T', ' ')}\n`
    header += `#Fields: provider http-method status-code uri-path time-taken response-size cache-status\n`

    return header + logs.map(log => log.toAgoraV1_0()).join('\n')
  }

  constructor(props) {
    this.provider = props.provider || null 
    this.httpMethod = props.httpMethod || null 
    this.statusCode = props.statusCode || null 
    this.protocol = props.protocol || null 
    this.uriPath = props.uriPath || null 
    this.timeTaken = props.timeTaken || null 
    this.responseSize = props.responseSize || null 
    this.cacheStatus = props.cacheStatus || null 
  }

  toJSON() {
    const object = {}
    for (const prop in this) {
      if (Object.hasOwnProperty.call(this, prop))
        object[prop] = this[prop]
    }
    return object
  }

  toMinhaCDN() {
    this.#validateRequiredProperties(['responseSize', 'statusCode', 'cacheStatus', 'httpMethod', 'uriPath', 'protocol', 'timeTaken'])
    return `${this.responseSize}|${this.statusCode}|${this.cacheStatus}|"${this.httpMethod} ${this.uriPath} ${this.protocol}"|${this.timeTaken}`
  }

  toAgoraV1_0() {
    this.#validateRequiredProperties(['provider', 'httpMethod', 'statusCode', 'uriPath', 'timeTaken', 'responseSize', 'cacheStatus'])
    return `"${this.provider}" ${this.httpMethod} ${this.statusCode} ${this.uriPath} ${this.timeTaken} ${this.responseSize} ${this.cacheStatus}`
  }

  #validateRequiredProperties(props) {
    if (!Array.isArray(props) || props.some(prop => typeof prop !== 'string'))
      throwErr(new Error('Call error validateRequiredProperties - Wrong call signature!'))

    for (const prop of props) {
      if (!this[prop])
        throwErr(new ParseError(`Missing required property "${prop}" at log - Got ${this.toJSON()}`))
    }

  }

}