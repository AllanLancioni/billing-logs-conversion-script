import test from 'ava'
import App from '../bin/src/App.js'
import { urls } from './mock/index.js'

const outputPath = './output/log.txt'

test('Run whole app with right params', t => {
  return new App(urls.validInputURL, outputPath)
    .run({overwriteFile: true})
    .then(res => t.pass())
    .catch(err => t.fail())
})

test('Run whole app with inexistent url', t => {
  return new App(urls.inexistentInputURL, outputPath)
    .run({overwriteFile: true})
    .then(res => t.fail())
    .catch(err => t.pass())
})


test('New App instance => notAInputUrl', t => {
  try {
    new App(urls.notAInputUrl, outputPath)
    t.fail()    
  } catch (error) {
    t.pass()    
  }
})

test('New App instance => notAString', t => {
  try {
    new App(urls.notAString, outputPath)
    t.fail()    
  } catch (error) {
    t.pass()    
  }
})

test('Fetch method => validInputURL', t => {
  return new App(urls.validInputURL, outputPath)
    .fetchData(urls.validInputURL)
    .then(text => {
      if (typeof text === 'string')
        t.pass()
      else
        t.fail()
    })
    .catch(() => t.fail())
})

test('Fetch method => notLogsInputURL', t => {
  return new App(urls.notLogsInputURL, outputPath)
    .fetchData(urls.notLogsInputURL)
    .then(text => {
      if (typeof text === 'string')
        t.pass()
      else
        t.fail()
    })
    .catch(() => t.fail())
})

