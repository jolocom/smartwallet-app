import {Parser} from '../rdf'
import LDPAgent from './ldp'
import Util from '../util'
import {SSN} from '../namespaces.js'
import N3 from 'n3'
import _ from 'lodash'

let N3Util = N3.Util

// Chat related functions
class SensorAgent extends LDPAgent {

  constructor() {
    super()
    this.subscriptions = {}
  }

  // @param {String} initiator itiator's webid url
  // @param {Array.<String>} participants webids of participants (including the initiator)
  //
  // @return {Promise.<Object>} object containing conversation id and doc url
  // create(sensor) {
  //   // POST conversation to initiators container
  //   // update inbox indices of all participants
  //   //
  //   let id = Util.randomString(5)
  //
  //   let hdrs = {'Content-type': 'text/turtle'}
  //   return this._conversationTriples(initiator, participants)
  //     .then((conversationDocContent) => {
  //       return this.put(conversationDoc, hdrs, conversationDocContent)
  //     })
  //     .then(() => {
  //       return Promise.all(participants.map((p) => {
  //         this._linkConversation(conversationDoc, p)
  //       }))
  //     })
  //     .then(() => {
  //       // update inbox indices
  //       console.log('successfully created conversation and linked it to participant inboxes')
  //       return {
  //         id: conversationId,
  //         url: conversationDoc
  //       }
  //     })
  // }
  //
  // update(conversationUrl, temp) {
  //   //TODO: implement
  //   console.log(conversationUrl)
  //   console.log(author)
  //   console.log(content)
  //   let msgId = `#${Util.randomString(5)}`
  //   let conversationId = `${conversationUrl}#thread`
  //   return this.get(conversationUrl)
  //     .then((xhr) => {
  //       let parser = new Parser()
  //       return parser.parse(xhr.response)
  //     })
  //     .then((result) => {
  //       let triples = [{// this is a message
  //         subject: msgId,
  //         predicate: RDF.type,
  //         object: SIOC.Post
  //       }, { // written by...
  //         subject: msgId,
  //         predicate: SIOC.hasCreator,
  //         object: author
  //       }, { // with content...
  //         subject: msgId,
  //         predicate: SIOC.content,
  //         object: N3Util.createLiteral(content)
  //       }, { // with timestamp...
  //         subject: msgId,
  //         predicate: DC.created,
  //         object: N3Util.createLiteral(new Date().getTime())
  //       }, { // contained by
  //         subject: msgId,
  //         predicate: SIOC.hasContainer,
  //         object: conversationId
  //       }, {
  //         subject: conversationId,
  //         predicate: SIOC.containerOf,
  //         object: msgId
  //       }]
  //
  //       let writer = new Writer({prefixes: result.prefixes})
  //       for (var t of result.triples) {
  //         writer.addTriple(t)
  //       }
  //       for (t of triples) {
  //         writer.addTriple(t)
  //       }
  //       return writer.end()
  //     })
  //     .then((result) => {
  //       let hdrs = {'Content-type': 'text/turtle'}
  //       return this.put(conversationUrl, hdrs, result)
  //     })
  // }

  // Returns relevant sensor metadata
  //
  // @param {String} url Sensor resource url
  //
  // @return {Object} conversation meta: updatesVia
  info(url) {
    let result = {}
    return this.get(url)
      .then((xhr) => {
        result.updatesVia = xhr.getResponseHeader('updates-via')
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((r) => {
        let name = _.find(r.triples, (t) => t.predicate == SSN.Sensor)
        if (name) {
          result.name = N3Util.getLiteralValue(value.object)
        }

        let value = _.find(r.triples, (t) => t.predicate == SSN.hasValue)
        if (value) {
          result.value = N3Util.getLiteralValue(value.object)
        }

        return result
      })
  }

  subscribe(url, callback) {
    let subscriptionId = `#${Util.randomString(5)}`

    url = url.replace('#sensor', '')

    return this.info(url)
      .then((info) => {
        console.log('info', info)
        try {
          let socket = new WebSocket(info.updatesVia)

          socket.onopen = function() {
            this.send(`sub ${url}`)
          }

          socket.onmessage = (msg) => {
            if (msg.data && msg.data.slice(0, 3) === 'pub') {
              this.info(url).then(callback)
            }
          }

          this.subscriptions[subscriptionId] = socket

          return subscriptionId
        } catch(e) {
          console.log(e)
          return false
        }
      })
  }

  unsubscribe(id) {
    if (this.subscriptions[id]) {
      this.subscriptions[id].close()
      delete this.subscriptions[id]
    }
  }

}

export default SensorAgent
