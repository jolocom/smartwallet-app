import * as settings from 'settings'

const DEFAULT_ACCEPT = '*/*'
const DEFAULT_CT = 'application/n-triples'

// kindly stolen from client-client
function statementToNT (statement, excludeDot) {
  if (typeof statement !== 'string') {
    // This is an RDF Statement. Convert to string
    statement = statement.toNT()
  }
  if (excludeDot && statement.endsWith('.')) {
    statement = statement.slice(0, -1)
  }
  return statement
}

/**
 * Composes and returns a PATCH SPARQL query (for use with `web.patch()`)
 * @method composePatchQuery
 * @param toDel {Array<String|Statement>} List of triples to delete
 * @param toIns {Array<String|Statement>} List of triples to insert
 * @return {String} SPARQL query for use with PATCH
 */
function composePatchQuery (toDel, toIns) {
  var query = ''
  var excludeDot = true
  if (toDel && toDel.length > 0) {
    toDel = toDel.map(function (st) {
      return statementToNT(st, excludeDot)
    })
    query += 'DELETE DATA { ' + toDel.join(' . ') + ' };\n'
  }
  if (toIns && toIns.length > 0) {
    toIns = toIns.map(function (st) {
      return statementToNT(st, excludeDot)
    })
    query += 'INSERT DATA { ' + toIns.join(' . ') + ' };\n'
  }
  return query
}

// HTTP Requests
class HTTPAgent {
  constructor({proxy} = {}) {
    this._fetch = window.fetch
    this._proxyURL = proxy === true ? settings.proxy : null
  }

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
  // @param {string} body replacement object
  // @param {Object} headers headers hash
  //
  // @return {Promise} promise with resulting xhr
  put(url, body, headers) {
    return this._req(url, 'PUT', body, headers)
  }

  // POST a resource to a container
  //
  // @param {string} url container url
  // @param {string} body new resource
  // @param {Object} headers headers hash
  //
  // @return {Promise} promise with resulting xhr
  post(url, body, headers) {
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

  _proxify(uri) {
    console.warning('DEPRECATED - HTTPAgent._proxify: ' +
                    'pass proxy option to constructor instead')
    return this.__proxify(uri)
  }

  __proxify(uri) { // Temporary to gracefuly deprecate public use of _proxify
    if (!uri) {
      return
    }
    let mode = localStorage.getItem('jolocom.auth-mode')
    if (mode === 'cert') {
      return uri
    }
    return `${this._proxyURL}/proxy?url=${uri}`
  }

  patch(url, toDel, toIns) {
    return this._req(url, 'PATCH', composePatchQuery(toDel, toIns), {
      'Content-Type': 'application/sparql-update'
    })
  }

  _req(url, method, body = null, headers = {
    'Accept': DEFAULT_ACCEPT,
    'Content-type': DEFAULT_CT
  }) {
    if (this._proxyURL) {
      url = this.__proxify(url)
    }

    return this._fetch(url, {
      method,
      headers,
      body,
      credentials: 'include'
    })
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
      if (response.headers.get('Content-Type') === 'application/json') {
        return response.json()
      } else {
        // @TODO parse turtle automatically?
        return response
      }
    })
  }

  /* helper method for making XMLHttpRequests
   *
   * @param {string} url resource url
   * @param {string} method HTTP verb
   * @param {string} body optional request body
   * @param {object} headers request headers
   */

  // _req(url, method = 'GET', body = null, headers = {
  //   'Accept': DEFAULT_ACCEPT, 'Content-type': DEFAULT_CT
  // }) {
  //   return new Promise((resolve, reject) => {
  //     let xhr = new XMLHttpRequest()
  //     xhr.withCredentials = true
  //     xhr.open(method, url, true)
  //     for (var headerKey in headers) {
  //       let headerValue = headers[headerKey]
  //       xhr.setRequestHeader(headerKey, headerValue)
  //     }
  //     xhr.onload = (event) => {
  //       if ((event.target.status >= 200 && event.target.status < 300) ||
  //         event.target.status === 304) {
  //         resolve(event.target)
  //       } else {
  //         reject(new Error(event.target.status))
  //       }
  //     }
  //     xhr.onerror = (error) => {
  //       reject(error)
  //     }

  //     if (body) {
  //       xhr.send(body)
  //     } else {
  //       xhr.send()
  //     }
  //   })
  // }
}

export default HTTPAgent
