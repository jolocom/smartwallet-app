const DEFAULT_ACCEPT = '*/*'
const DEFAULT_CT = 'application/n-triples'

// HTTP Requests
class HTTPAgent {

  // GET a resource represented by url
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  get(url, headers) {
    return this._req(url, 'GET', null, headers)
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
  // @param {Object} headers headers hash
  // @param {string} body replacement object
  //
  // @return {Promise} promise with resulting xhr
  put(url, headers, body) {
    return this._req(url, 'PUT', body, headers)
  }


  // POST a resource to a container
  //
  // @param {string} url container url
  // @param {Object} headers headers hash
  // @param {string} body new resource
  //
  // @return {Promise} promise with resulting xhr
  post(url, headers, body) {
    return this._req(url, 'POST', body, headers)
  }


  // HEAD request (used for identifying WebID session)
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  head(url) {
    return this._req(url, 'HEAD')
  }


  /* helper method for making XMLHttpRequests
   *
   * @param {string} url resource url
   * @param {string} method HTTP verb
   * @param {string} body optional request body
   * @param {object} headers request headers
   */ 

  _req(url, method='GET', body=null, headers={'Accept': DEFAULT_ACCEPT, 'Content-type': DEFAULT_CT}) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open(method, url, true)
      for (var headerKey in headers) {
        let headerValue = headers[headerKey]
        xhr.setRequestHeader(headerKey, headerValue)
      }
      xhr.onload = (event) => {
        if ((event.target.status >= 200 && event.target.status < 300) || event.target.status == 304) {
          resolve(event.target)
        }
        else {
          reject(new Error(event.target.status))
        }
      }
      xhr.onerror = (error) => {
        reject(error)
      }

      if (body)
        xhr.send(body)
      else
        xhr.send()
    })
  }
}

export default HTTPAgent
