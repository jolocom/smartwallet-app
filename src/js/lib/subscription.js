import HTTPAgent from './agents/http'
import Util from './util'

export default class Subscription {
  constructor(url, options, callback) {
    this.url = url

    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    this.options = Object.assign({
      interval: 10000
    }, options)

    this.callback = callback

    // Proxy doesnt support websocket, fallback to polling
    if (localStorage.getItem('jolocom.auth-mode') !== 'proxy') {
      this.initWebSocket()
    } else {
      this.initPolling()
    }
  }
  initWebSocket() {
    const http = new HTTPAgent()

    http.get(Util.uriToProxied(this.url)).then((xhr) => {
      const updatesVia = xhr.getResponseHeader('updates-via')
      this.socket = new WebSocket(updatesVia)

      this.socket.onopen = () => {
        this.socket.send(`sub ${this.url}`)
      }

      this.socket.onmessage = (msg) => {
        if (msg.data && msg.data.slice(0, 3) === 'pub') {
          this.callback && this.callback(this)
        }
      }
    }).catch((e) => {
      throw e
    })
  }
  initPolling() {
    // @TODO move this to serviceworkers?
    this.interval = setInterval(() => {
      this.callback && this.callback(this)
    }, this.options.interval)
  }
  stop() {
    if (this.socket) {
      // @TODO 'unsub' not supported by solid yet, closing socket should be
      // enough :)
      this.socket.close()
    } else {
      clearInterval(this.interval)
    }
  }
}
