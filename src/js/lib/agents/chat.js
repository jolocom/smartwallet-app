import {Parser, Writer} from '../rdf'
import LDPAgent from './ldp'
import Util from '../util'
import {PRED, FOAF, RDF, SIOC} from '../namespaces.js'
import N3 from 'n3'
import _ from 'lodash'
import rdf from 'rdflib'
import solid from 'solid-client'

let N3Util = N3.Util

// Chat related functions
class ChatAgent extends LDPAgent {

  // @param {String} initiator itiator's webid url
  // @param {Array.<String>} participants webids of participants (including the initiator)
  //
  // @return {Promise.<Object>} object containing conversation id and doc url
  createConversation(initiator, participants) {
    // POST conversation to initiators container
    // update inbox indices of all participants
    //
    let conversationId = Util.randomString(5)
    let conversationDoc = `${Util.webidRoot(initiator)}/little-sister/chats/${conversationId}`
    let hdrs = {'Content-type': 'text/turtle'}
    let conversationDocContent = this._conversationTriples(initiator, participants)
    return this.put(Util.uriToProxied(conversationDoc), hdrs, conversationDocContent).then(() => {
      return Promise.all(participants.map((p) => {
        this._linkConversation(conversationDoc, p)
      }))
    })
    .then(() => {
      // update inbox indices
      console.log('successfully created conversation and linked it to participant inboxes')
      return {
        id: conversationId,
        url: conversationDoc
      }
    })
  }

  postMessage(conversationUrl, author, content) {
    //TODO: implement
    let msgId = `#${Util.randomString(5)}`
    let conversationId = `${conversationUrl}#thread`
    return this.get(conversationUrl)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response, conversationId)
      })
      .then((result) => {
        let triples = [{// this is a message
          subject: msgId,
          predicate: PRED.type,
          object: PRED.post
        }, { // written by...
          subject: msgId,
          predicate: PRED.hasCreator,
          object: author
        }, { // with content...
          subject: msgId,
          predicate: PRED.content,
          object: N3Util.createLiteral(content)
        }, { // with timestamp...
          subject: msgId,
          predicate: PRED.created,
          object: N3Util.createLiteral(new Date().getTime())
        }, { // contained by
          subject: msgId,
          predicate: PRED.hasContainer,
          object: conversationId
        }, {
          subject: conversationId,
          predicate: PRED.containerOf,
          object: msgId
        }]

        let writer = new Writer({prefixes: result.prefixes})
        for (var t of result.triples) {
          writer.addTriple(t)
        }
        for (t of triples) {
          writer.addTriple(t)
        }
        return writer.end()
      })
      .then((result) => {
        let hdrs = {'Content-type': 'text/turtle'}
        return this.put(conversationUrl, hdrs, result)
      })
  }

  // FIXME: should find a better way to read data \Justas
  getConversationMessages(conversationUrl) {
    return this.get(conversationUrl)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response, conversationUrl)
      })
      .then((result) => {
        let posts = result.triples.filter((t) => {
          return t.predicate.uri === PRED.type.uri &&
            t.object.uri === PRED.post.uri
        }).map((t) => t.subject)
        let groups = posts.reduce((acc, curr) => {
          if (!(curr in acc)) {
            acc[curr] = {}
          }
          for (var t of result.triples) {
            if (t.subject != curr) {
              continue
            }
            if (t.predicate.uri == PRED.content.uri) {
              acc[curr].content = N3Util.getLiteralValue(t.object)
            }
            if (t.predicate.uri == PRED.created.uri) {
              acc[curr].created = new Date(
                parseInt(N3Util.getLiteralValue(t.object))
              )
            }
            if (t.predicate.uri == PRED.hasCreator.uri) {
              acc[curr].author = t.object.value
            }
          }
          return acc
        }, {})

        let msgs = []
        for (var p of posts) {
          msgs.push(groups[p])
        }
        msgs.sort((a, b) => a.created - b.created)

        return msgs
      })

  }

  // Returns relevant conversation metadata (id, updatesVia, otherPerson, lastMessage)
  //
  // @param {String} conversationUrl conversation resource url
  //
  // @return {Object} conversation meta: id, updatesVia, otherPerson, lastMessage
  getConversation(conversationUrl) {
    let result = {
      id: conversationUrl.replace(/^.*\/chats\/([a-z0-9]+)$/i, '$1')
    }
    return this.get(conversationUrl)
      .then((xhr) => {
        result.updatesVia = xhr.getResponseHeader('updates-via')
        let parser = new Parser()
        return parser.parse(xhr.response, conversationUrl)
      })
      .then((parsed) => {
        return Promise.all([
          this._lastMessage(conversationUrl),
          this._otherPerson(parsed.triples, conversationUrl)
        ])
      })
      .then((tmp) => {
        let [lastMessage, otherPerson] = tmp
        result.lastMessage = lastMessage
        result.otherPerson = otherPerson
        return result
      })
  }

  _lastMessage(conversationUrl) {
    return this.getConversationMessages(conversationUrl)
      .then((messages) => {
        if (messages.length == 0) {
          return null
        } else {
          return messages[messages.length - 1]
        }
      })
  }

  _otherPerson(triples, conversationUrl) {
    //TODO
    let aboutThread = _.filter(triples, (t) => {
      return t.subject == '#thread' || t.subject == `${conversationUrl}#thread`
    })
    let owner = _.find(aboutThread, (t) => {
      return t.predicate.uri == PRED.hasOwner.uri
    })
    if (owner) {
      owner = owner.object
    }
    let participants = _.map(_.filter(aboutThread, (t) => {
      return t.predicate.uri == PRED.hasSubscriber.uri
    }), (t) => t.object)
    let otherPerson = _.find(participants, (p) => p !== owner)

    if (!otherPerson) {
      return Promise.resolve(null)
    }

    let webid = otherPerson.value

    let result = {}
    return this.get(webid)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response, webid)
      })
      .then((parsed) => {
        let aboutPerson = _.filter(parsed.triples, (t) => {
          return t.subject == webid || t.subject == '#me'
        })

        let name = _.find(aboutPerson, (t) => {
          return t.predicate.uri == PRED.fullName.uri
        })

        if (name) {
          result.name = N3Util.getLiteralValue(name.object)
        }

        let img = _.find(aboutPerson, (t) => {
          return t.predicate.uri == PRED.image.uri
        })

        if (img) {
          result.img = img.object.value
        }

        result.webid = otherPerson

        return result
      })
  }

  getInboxConversations(webid) {
    let inbox = `${Util.webidRoot(webid)}/little-sister/inbox`
    return this.get(inbox)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response, inbox)
      })
      .then((result) => {
        return result.triples.filter((t) => {
          return t.predicate.uri === PRED.spaceOf.uri
        }).map((t) => t.object.value)
      })
  }

  _linkConversation(conversationUrl, webid) {
    let inbox = `${Util.webidRoot(webid)}/little-sister/inbox`

    var graph = rdf.graph()

    graph.add('#inbox', PRED.spaceOf, rdf.sym(conversationUrl))

    var toAdd = []
    graph.statementsMatching('#inbox', undefined, undefined)
      .forEach(function (st) {
        toAdd.push(st.toNT())
      })

    return solid.web.patch(inbox, null, toAdd)
  }

  _conversationTriples(initiator, participants) {
    let writer = new Writer()

    let triples = [
      {
        subject: '',
        predicate: PRED.title,
        object: N3Util.createLiteral(`Conversation created by ${initiator}`)
      },
      {
        subject: '',
        predicate: PRED.maker,
        object: initiator
      },
      {
        subject: '',
        predicate: PRED.primaryTopic,
        object: '#thread'
      },
      {
        subject: '#thread',
        predicate: PRED.type,
        object: PRED.Thread
      },
      {
        subject: '#thread',
        predicate: PRED.hasOwner,
        object: initiator
      }
    ]

    for (var t of triples) {
      writer.addTriple(t)
    }

    // Participant list
    for (var p of participants) {
      writer.addTriple({
        subject: '#thread',
        predicate: PRED.hasSubscriber,
        object: p
      })
    }

    return writer.end()
  }

}

export default ChatAgent
