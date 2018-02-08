// HTTP Requests
class HTTPAgent {
  constructor() {
    this._fetch = window && window.fetch ? window.fetch.bind(window) : null
  }

  // GET a resource represented by url
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  get(url, headers, options) {
    return this._req(url, 'GET', null, headers, options)
  }

  // DELETE a resource represented by url
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  delete(url, headers) {
    return this._req(url, 'DELETE', null, headers)
  }

  // PUT a resource represented by url
  //
  // @param {string} url resource url
  // @param {string} body replacement object
  // @param {Object} headers headers hash
  //
  // @return {Promise} promise with resulting xhr
  put(url, body, headers, options) {
    return this._req(url, 'PUT', body, headers, options)
  }

  // POST a resource to a container
  //
  // @param {string} url container url
  // @param {string} body new resource
  // @param {Object} headers headers hash
  //
  // @return {Promise} promise with resulting xhr
  post(url, body, headers, options) {
    return this._req(url, 'POST', body, headers, options)
  }

  // HEAD request (used for identifying WebID session)
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  head(url) {
    return this._req(url, 'HEAD')
  }

  _req(url, method, body = null, headers = new Headers({
    'Accept': '*/*',
    'Content-Type': 'application/json'
  }), options = {}) {
    return this._fetch(url, Object.assign({
      method,
      headers,
      body: JSON.stringify(body)
    }, options))
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    })
    .then((response) => {
      if (response.headers.get('Content-Type')
      .indexOf('application/json') === 0) {
        return response.json()
      } else {
        return response
      }
    })
  }
}
export default HTTPAgent
