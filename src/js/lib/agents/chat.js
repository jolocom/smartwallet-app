import {Parser, Writer} from '../rdf'
import LDPAgent from './ldp'
import Util from '../util'
import {PRED, SOLID} from '../namespaces.js'
import N3 from 'n3'
import $rdf from 'rdflib'

let N3Util = N3.Util

// Chat related functions
export default class ChatAgent extends LDPAgent {

  // @param {String} initiator itiator's webid url
  // @param {Array.<String>} participants webids (including the initiator)
  //
  // @return {Promise.<Object>} object containing conversation id and doc url
  createConversation(initiator, participants, subject) {
    // POST conversation to initiators container
    // update inbox indices of all participants
    let conversationId = Util.randomString(5)
    let conversationDoc =
      `${Util.webidRoot(initiator)}/little-sister/chats/${conversationId}`
    let hdrs = {'Content-type': 'text/turtle'}
    let conversationDocContent = this._conversationTriples(
      conversationDoc, initiator, participants, subject
    )

    return this.put(
      Util.uriToProxied(conversationDoc), conversationDocContent, hdrs
    ).then(() => {
      return Promise.all([initiator].concat(participants).map((p) =>
        this._linkConversation(conversationDoc, p)
      ))
    }).then(() => {
      return this._writeConversationAcl(
        conversationDoc, initiator, participants
      )
    })
    .then(() => {
      return {
        id: conversationId,
        url: conversationDoc,
        initiator,
        participants,
        subject
      }
    })
  }

  _writeConversationAcl(uri, initiator, participants = []) {
    let writer = new Writer()
    let ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    let aclUri = `${uri}.acl`

    writer.addTriple($rdf.sym('#owner'), PRED.type, ACL('Authorization'))
    writer.addTriple($rdf.sym('#owner'), ACL('accessTo'), $rdf.sym(uri))
    writer.addTriple($rdf.sym('#owner'), ACL('accessTo'), $rdf.sym(aclUri))
    writer.addTriple($rdf.sym('#owner'), ACL('agent'), $rdf.sym(initiator))
    writer.addTriple($rdf.sym('#owner'), ACL('mode'), ACL('Control'))
    writer.addTriple($rdf.sym('#owner'), ACL('mode'), ACL('Read'))
    writer.addTriple($rdf.sym('#owner'), ACL('mode'), ACL('Write'))

    participants.forEach((participant) => {
      writer.addAll(this._getParticipantACL(uri, participant))
    })

    return this.put(this._proxify(aclUri), writer.end(), {
      'Content-Type': 'text/turtle'
    }).then(() => {
      return aclUri
    }).catch((e) => {
      console.error(e, 'occured while putting the acl file')
    })
  }

  _getParticipantACL(uri, participant) {
    const subject = $rdf.sym('#participant')
    const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    let statements = []
    statements.push($rdf.triple(subject, PRED.type, ACL('Authorization')))
    statements.push($rdf.triple(subject, ACL('accessTo'), $rdf.sym(uri)))
    statements.push($rdf.triple(subject, ACL('agent'), $rdf.sym(participant)))
    statements.push($rdf.triple(subject, ACL('mode'), ACL('Read')))
    statements.push($rdf.triple(subject, ACL('mode'), ACL('Write')))

    return statements.push
  }

  _getMessageTriples({id, conversationId, author, content, created}) {
    if (!N3Util.isLiteral(content)) {
      content = N3Util.createLiteral(content)
    }

    if (!N3Util.isLiteral(created)) {
      created = N3Util.createLiteral(created)
    }

    return [{// this is a message
      subject: id,
      predicate: PRED.type,
      object: PRED.post
    }, { // written by...
      subject: id,
      predicate: PRED.hasCreator,
      object: author
    }, { // with content...
      subject: id,
      predicate: PRED.content,
      object: content
    }, { // with timestamp...
      subject: id,
      predicate: PRED.created,
      object: created
    }, { // contained by
      subject: id,
      predicate: PRED.hasContainer,
      object: conversationId
    }, {
      subject: conversationId,
      predicate: PRED.containerOf,
      object: id
    }]
  }

  postMessage(conversationUrl, author, content) {
    const conversationId = `${conversationUrl}#thread`
    const message = {
      id: `#${Util.randomString(5)}`,
      conversationId,
      author,
      content,
      created: new Date().getTime()
    }

    return this.get(this._proxify(conversationUrl)).then((response) => {
      // store this in memory, so we dont need to fetch all data everytime
      return response.text().then((text) => {
        return new Parser(text, conversationId)
      })
    }).then((conversation) => {
      const writer = new Writer()
      const uri = this._proxify(conversationUrl)

      writer.addAll(this._getMessageTriples(message))

      return this.patch(uri, null, writer.all()).then(() => {
        const participants = conversation.find(
          '#thread',
          PRED.hasSubscriber,
          undefined
        ).map((t) => {
          return t.object.value
        })

        this.notifyParticipants(participants, message)
      })
    })
  }
  getConversationMessages(conversationUrl) {
    return this.get(this._proxify(conversationUrl))
      .then((response) => {
        return response.text().then((text) => {
          let parser = new Parser()
          return parser.parse(text, conversationUrl)
        })
      })
      .then((result) => {
        let posts = result.triples.filter((t) => {
          return t.predicate.uri === PRED.type.uri &&
            t.object.uri === PRED.post.uri
        }).map((t) => t.subject)
        let groups = posts.reduce((acc, curr) => {
          if (!(curr in acc)) {
            acc[curr] = {
              id: curr.toString()
            }
          }
          for (var t of result.triples) {
            if (t.subject !== curr) {
              continue
            }
            if (t.predicate.uri === PRED.content.uri) {
              acc[curr].content = N3Util.getLiteralValue(t.object)
            }
            if (t.predicate.uri === PRED.created.uri) {
              acc[curr].created = new Date(
                parseInt(N3Util.getLiteralValue(t.object))
              )
            }

            if (t.predicate.uri === PRED.hasCreator.uri) {
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
    return this.get(this._proxify(conversationUrl))
      .then((response) => {
        result.updatesVia = response.headers.get('updates-via')
        return response.text().then((text) => {
          return new Parser(text, conversationUrl)
        })
      })
      .then((parsed) => {
        return Promise.all([
          this._lastMessage(conversationUrl),
          this._getParticipants(parsed, conversationUrl),
          this._getSubject(parsed, conversationUrl)
        ])
      })
      .then(([lastMessage, participants, subject]) => {
        result.uri = conversationUrl
        result.subject = subject
        result.lastMessage = lastMessage
        result.participants = participants
        return result
      })
      .catch((e) => {
        console.error('Failed to load conversation', e, conversationUrl)
      })
  }

  _getSubject(parsed, conversationUrl) {
    const subject = parsed.get(undefined, PRED.title, undefined)

    return subject && subject.object.value
  }

  _lastMessage(conversationUrl) {
    return this.getConversationMessages(conversationUrl)
      .then((messages) => {
        if (messages.length === 0) {
          return null
        } else {
          return messages[messages.length - 1]
        }
      })
  }

  _getParticipants(parsed, uri) {
    let participants = parsed.find(undefined, PRED.hasSubscriber, undefined)
    return Promise.all(participants.map((t) => {
      return this.getParticipantData(t.object.value)
    }))
  }

  getParticipantData(uri) {
    return this.get(this._proxify(uri))
      .then((response) => {
        return response.text().then((text) => {
          return new Parser(text, uri)
        })
      })
      .then((parsed) => {
        let result = {}

        let name = parsed.get(undefined, PRED.fullName, undefined) ||
          parsed.get(undefined, PRED.givenName, undefined)

        if (name) {
          result.name = name.object.value
        }

        let img = parsed.get($rdf.sym(uri), PRED.image, undefined)
        if (img) {
          result.img = img.object.value
        }

        result.webid = uri

        return result
      })
  }

  getInboxConversations(webId) {
    let inbox = `${Util.webidRoot(webId)}/little-sister/inbox`

    return this.get(this._proxify(inbox))
      .then((response) => {
        return response.text().then((text) => {
          return new Parser(text, inbox)
        })
      })
      .then((result) => {
        return result.find(undefined, PRED.spaceOf)
          .map((t) => t.object.value || t.object.uri)
      })
  }

  getUnreadMessagesContainer(webId) {
    return `${Util.webidRoot(webId)}/little-sister/unread-messages`
  }

  _parseMessages(g) {
    const schema = {
      author: PRED.hasCreator,
      content: PRED.content,
      created: PRED.created,
      conversationId: PRED.hasContainer
    }
    const subjects = g.find(undefined, PRED.type, PRED.post)

    const messages = []

    subjects.forEach(({subject}) => {
      const id = subject.toString()

      let message = {
        id
      }

      for (let field in schema) {
        let value = g.any(id, schema[field])

        if (value) {
          message[field] = value.toString()
        }
      }

      messages.push(message)
    })

    return messages
  }

  getUnreadMessagesIds(webId) {
    let container = this.getUnreadMessagesContainer(webId)
    return this.get(this._proxify(container))
      .then((response) => {
        return response.text().then((text) => {
          return new Parser(text, webId)
        })
      })
      .then((g) => {
        const ids = g.find(undefined, PRED.type, SOLID.Notification)

        return ids.map(({subject}) => {
          return subject.toString()
        })
      })
  }

  getUnreadMessages(webId) {
    let container = this.getUnreadMessagesContainer(webId)
    return this.get(this._proxify(container))
      .then((response) => {
        return response.text().then((text) => {
          return new Parser(text, webId)
        })
      })
      .then(this._parseMessages)
  }

  notifyParticipants(participants, message) {
    participants.forEach((participant) => {
      if (participant !== message.author) {
        this.addUnreadMessage(participant, message)
      }
    })
  }

  addUnreadMessage(participant, message) {
    const container = this.getUnreadMessagesContainer(participant)
    const writer = new Writer()

    writer.add(message.id, PRED.type, SOLID.Notification)

    writer.addAll(this._getMessageTriples(message))

    return this.patch(this._proxify(container), null, writer.all())
  }

  removeUnreadMessage(webId, message) {
    const container = this.getUnreadMessagesContainer(webId)

    const writer = new Writer()

    writer.add(message.id, PRED.type, SOLID.Notification)

    writer.addAll(this._getMessageTriples(message))

    return this.patch(this._proxify(container), writer.all())
  }

  _linkConversation(conversationUrl, webId) {
    const inbox = `${Util.webidRoot(webId)}/little-sister/inbox`

    const writer = new Writer()

    writer.add('#inbox', PRED.spaceOf, $rdf.lit(conversationUrl))

    this.patch(this._proxify(inbox),
      null, writer.all()
    )
  }

  _conversationTriples(conversationUrl, initiator, participants, subject = '') {
    let writer = new Writer()

    conversationUrl += '#thread'

    if (!N3Util.isLiteral(subject)) {
      subject = N3Util.createLiteral(subject)
    }

    let triples = [{
      subject: '',
      predicate: PRED.title,
      object: subject
    }, {
      subject: '',
      predicate: PRED.maker,
      object: $rdf.sym(initiator)
    }, {
      subject: '',
      predicate: PRED.primaryTopic,
      object: $rdf.sym(conversationUrl)
    }, {
      subject: $rdf.sym(conversationUrl),
      predicate: PRED.type,
      object: PRED.Thread
    }, {
      subject: $rdf.sym(conversationUrl),
      predicate: PRED.hasOwner,
      object: $rdf.sym(initiator)
    }]

    writer.addAll(triples)

    writer.addTriple({
      subject: $rdf.sym(conversationUrl),
      predicate: PRED.hasSubscriber,
      object: $rdf.sym(initiator)
    })

    // Participant list
    for (let p of participants) {
      writer.addTriple({
        subject: $rdf.sym(conversationUrl),
        predicate: PRED.hasSubscriber,
        object: $rdf.sym(p)
      })
    }

    return writer.end()
  }

  setSubject(uri, oldSubject, newSubject) {
    const oldTriple = $rdf.st('', PRED.title, $rdf.literal(oldSubject))

    const newTriple = $rdf.st('', PRED.title, $rdf.literal(newSubject))

    return this.patch(this._proxify(uri), [oldTriple], [newTriple])
  }

  addParticipant(uri, webId) {
    return Promise.all([
      () => {
        const toAdd = $rdf.st(
          '#thread', PRED.hasSubscriber, $rdf.sym(webId)
        )
        return this.patch(this._proxify(uri), undefined, [toAdd])
      },
      () => {
        const toAdd = this._getParticipantACL(uri, webId)
        return this.patch(this._proxify(`${uri}.acl`), undefined, toAdd)
      }
    ])
  }

  removeParticipant(uri, webId) {
    return Promise.all([
      () => {
        const toDel = $rdf.st(
          '#thread', PRED.hasSubscriber, $rdf.sym(webId)
        )
        return this.patch(this._proxify(uri), [toDel])
      },
      () => {
        const toDel = this._getParticipantACL(uri, webId)
        return this.patch(this._proxify(`${uri}.acl`), toDel)
      }
    ])
  }

}
