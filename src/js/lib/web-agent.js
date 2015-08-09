// Server interaction logic
class WebAgent {
  // GET a resource represented by url
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  get(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('GET', url, true)
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
      xhr.send()
    })
  }
}

export default WebAgent
