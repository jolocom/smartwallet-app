'use strict';

import {Parser, Writer} from '../rdf'
import LDPAgent from './ldp'
import Util from '../util'
import {PRED} from '../namespaces.js'
import N3 from 'n3'
import _ from 'lodash'
import rdf from 'rdflib'
import ConversationsStore from 'stores/conversations'

import Debug from 'lib/debug'
let debug = Debug('agents:chat')

let N3Util = N3.Util

// Chat related functions
class ChatAgent extends LDPAgent {

  // @param {String} initiator itiator's webid url
  // @param {Array.<String>} participants webids (including the initiator)
  //
  // @return {Promise.<Object>} object containing conversation id and doc url
  createConversation(initiator, participants) {
    let existingConversation =
      ConversationsStore.getConversationByWebId(participants[1])
    if (existingConversation) {
      debug('Found an existing conversation with', participants[1])
      return new Promise((resolve, reject) => {
        resolve({
          conversation: {
            id: existingConversation.id,
            url: existingConversation.uri
          },
          isNew: false
        })
      })
    } else {
      debug('Haven\'t found an existing conversation with', participants[1])
      // POST conversation to initiators container
      // update inbox indices of all participants
      let conversationId = Util.randomString(5)
      let conversationDoc =
        `${Util.webidRoot(initiator)}/little-sister/chats/${conversationId}`
      let hdrs = {'Content-type': 'text/turtle'}
      let conversationDocContent =
        this._conversationTriples(initiator, participants)
      return this.put(Util.uriToProxied(conversationDoc),
        hdrs, conversationDocContent).then(() => {
          return Promise.all(participants.map((p) =>
            this._linkConversation(conversationDoc, p)
        ))
        })
      .then(() => {
        return this._writeConversationAcl(conversationDoc,
          initiator, participants)
      })
      .then(() => {
        return {
          conversation: {
            id: conversationId,
            url: conversationDoc
          },
          isNew: true
        }
      })
    }
  }

  _writeConversationAcl(uri, initiator, participants = []) {
    let writer = new Writer()
    let ACL = rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    let aclUri = `${uri}.acl`

    writer.addTriple(rdf.sym('#owner'), PRED.type, ACL('Authorization'))
    writer.addTriple(rdf.sym('#owner'), ACL('accessTo'), rdf.sym(uri))
    writer.addTriple(rdf.sym('#owner'), ACL('accessTo'), rdf.sym(aclUri))
    writer.addTriple(rdf.sym('#owner'), ACL('agent'), rdf.sym(initiator))
    writer.addTriple(rdf.sym('#owner'), ACL('mode'), ACL('Control'))
    writer.addTriple(rdf.sym('#owner'), ACL('mode'), ACL('Read'))
    writer.addTriple(rdf.sym('#owner'), ACL('mode'), ACL('Write'))

    participants.forEach((participant) => {
      writer.addTriple(rdf.sym('#participant'), PRED.type, ACL('Authorization'))
      writer.addTriple(rdf.sym('#participant'), ACL('accessTo'), rdf.sym(uri))
      writer.addTriple(rdf.sym('#participant'),
        ACL('agent'), rdf.sym(participant))
      writer.addTriple(rdf.sym('#participant'), ACL('mode'), ACL('Read'))
      writer.addTriple(rdf.sym('#participant'), ACL('mode'), ACL('Write'))
    })

    return fetch(Util.uriToProxied(aclUri), {
      method: 'PUT',
      credentials: 'include',
      body: writer.end(),
      headers: {
        'Content-Type': 'text/turtle'
      }
    }).then(() => {
      return aclUri
    }).catch((e) => {
      console.error(e, 'occured while putting the acl file')
    })
  }

  addUserToChatSubscriberList(webIdOfUserToBeAdded, chatURI) {
    let subject, predicate, object
    chatURI = 'https://' + chatURI
    subject = rdf.sym(chatURI + '#thread')
    predicate = PRED.hasSubscriber
    webIdOfUserToBeAdded = 'https://' + webIdOfUserToBeAdded
    object = rdf.sym(webIdOfUserToBeAdded)
    let triple = rdf.st(subject, predicate, object)
    let statement = `INSERT DATA { ${triple} };`

    console.log(statement)

    return fetch(Util.uriToProxied(chatURI), {
      method: 'PATCH',
      credentials: 'include',
      body: statement,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    }).then(() => {
      console.log('Added participant to the conversation!')
    }).catch((e) => {
      console.error(e, 'Failed adding participant to conversation.')
    })
  }

  addUserToChatACL(aclURI) {
    let subject, predicate, object
    aclURI = 'https://' + aclURI
    subject = rdf.sym(chatURI + '#thread')
    predicate = PRED.hasSubscriber
    webIdOfUserToBeAdded = 'https://' + webIdOfUserToBeAdded
    object = rdf.sym(webIdOfUserToBeAdded)
    let triple = rdf.st(subject, predicate, object)
    let statement = `INSERT DATA { ${triple} };`

    let writer = new Writer()
    if (aclURI) {
      aclURI += '.acl'
    }
    return fetch(Util.uriToProxied(aclURI), {
      method: 'PATCH',
      credentials: 'include',
      body: writer.end(),
      headers: {
        'Content-Type': 'text/turtle'
      }
    }).then(() => {
      console.log('Added participant to the chat ACL')
    }).catch((e) => {
      console.error(e, 'Failed adding participant to the ACL')
    })
  }

  postMessage(conversationUrl, author, content) {
    // TODO: implement
    let msgId = `#${Util.randomString(5)}`
    let conversationId = `${conversationUrl}#thread`
    return this.get(Util.uriToProxied(conversationUrl))
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
        return this.put(Util.uriToProxied(conversationUrl), hdrs, result)
      })
  }
  getConversationMessages(conversationUrl) {
    return this.get(Util.uriToProxied(conversationUrl))
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response, conversationUrl)
      })
      .then((result) => {
        let posts = result.triples.filter((t) => {
          return t.predicate.uri == PRED.type.uri &&
            t.object.uri == PRED.post.uri
        }).map((t) => t.subject)
        let groups = posts.reduce((acc, curr) => {
          if (!(curr in acc)) {
            acc[curr] = {}
          }
          for (var t of result.triples) {
            if (t.subject !== curr) {
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
  // Returns relevant conversation metadata
  // (id, updatesVia, otherPerson, lastMessage)
  //
  // @param {String} conversationUrl conversation resource url
  //
  // @return {Object} conversation meta:
  // id, updatesVia, otherPerson, lastMessage
  getConversation(conversationUrl, myUri) {
    let result = {
      id: conversationUrl.replace(/^.*\/chats\/([a-z0-9]+)$/i, '$1')
    }
    return this.get(Util.uriToProxied(conversationUrl))
      .then((xhr) => {
        result.updatesVia = xhr.getResponseHeader('updates-via')
        let parser = new Parser()
        return parser.parse(xhr.response, conversationUrl)
      })
      .then((parsed) => {
        return Promise.all([
          this._lastMessage(conversationUrl),
          this._otherPerson(parsed.triples, conversationUrl, myUri)
        ])
      })
      .then((tmp) => {
        let [lastMessage, otherPerson] = tmp
        result.uri = conversationUrl
        result.lastMessage = lastMessage
        result.otherPerson = otherPerson
        return result
      })
      .catch(() => {
        console.error('Failed to load conversation', conversationUrl)
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

  _otherPerson(triples, conversationUrl, myUri) {
    // TODO
    let aboutThread = _.filter(triples, (t) => {
      // Using == because t.subject is an object
      // that has a .toString method
      return t.subject == '#thread' || t.subject ==
        `${conversationUrl}#thread`
    })
    // console.rdftable(aboutThread)

    // let owner = _.find(aboutThread, (t) => {
    //   return t.predicate.uri == PRED.hasOwner.uri
    // })
    // if (owner) {
    //   owner = owner.object
    // }

    // return Promise.resolve({webid: owner.value, name: owner.value})

    let participant = _.map(_.filter(aboutThread, (t) => {
      return t.predicate.uri === PRED.hasSubscriber.uri
    }), (t) => t.object)
    // let otherPerson = _.find(participant, (p) => p.value !== myUri)
    // if (!otherPerson) {
    //   return Promise.resolve(null)
    // }
    for (let person in participant) {
      if (participant[person].value === myUri) {
        participant.splice(person, 1)
      }
    }

    let promises = []
    for (let person in participant) {
      let webid = participant[person].value
      promises.push(this.get(Util.uriToProxied(webid))
        .then((xhr) => {
          let parser = new Parser()
          return parser.parse(xhr.response, webid)
        })
        .then((parsed) => {
          let aboutPerson = _.filter(parsed.triples, (t) => {
            return t.subject.uri === webid || t.subject.uri === '#me'
          })
          let name = _.find(parsed.triples, (t) => {
            return t.predicate.uri === PRED.givenName.uri
          })
          if (name) {
            participant[person].name = name.object.value
          }
          let img = _.find(aboutPerson, (t) => {
            return t.predicate.uri === PRED.image.uri
          })
          if (img) {
            participant[person].img = img.object.value
          }
          return participant[person]
        }))
    }
    return Promise.all(promises)
  }

  getInboxConversations(webid) {
    let inbox = `${Util.webidRoot(webid)}/little-sister/inbox`
    debug('Getting inbox conversations for webid', inbox)
    return this.get(Util.uriToProxied(inbox))
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response, inbox)
      })
      .then((result) => {
        debug('Received inbox conversations', result)
        return result.triples.filter((t) => {
          return t.predicate.uri === PRED.spaceOf.uri
        }).map((t) => t.object.value || t.object.uri)
      })
  }

  _linkConversation(conversationUrl, webid) {
    let inbox = `${Util.webidRoot(webid)}/little-sister/inbox`

    var graph = rdf.graph()

    graph.add('#inbox', PRED.spaceOf, rdf.lit(conversationUrl))

    var toAdd = []
    graph.statementsMatching('#inbox', undefined, undefined)
      .forEach(function (st) {
        toAdd.push(st.toNT())
      })

   // return solid.web.patch(inbox, null, toAdd)

    return fetch(Util.uriToProxied(inbox), {
      method: 'PATCH',
      credentials: 'include',
      body: `INSERT DATA { ${toAdd.join(' ')} } ;`,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    })
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
