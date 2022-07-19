import undici from 'undici'

export class DataFetcher {

  constructor() {
    this.httpClient = undici 
  }

  fetch(url, options = { method: 'GET', body: null }) {
    return this.httpClient.request(url, options)
  }

}