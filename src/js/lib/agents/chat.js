import {Parser, Writer} from '../rdf'
import Util from '../util'
import {PRED, SOLID, XSD} from '../namespaces.js'
import $rdf from 'rdflib'
import HTTPAgent from './http'

// Chat related functions
export default class ChatAgent {

  constructor() {
    this.http = new HTTPAgent({proxy: true})
  }

  /**
   *  @param {Object} [Conversation] Object containing the conversation params
   *
   *  @return {Promise.<Conversation>} The conversation
   */
  createConversation(conversation) {
    conversation = Object.assign({
      id: Util.randomString(5),
      created: new Date(),
      subject: ''
    }, conversation)

    let {id, initiator, participants} = conversation

    conversation.url = `${Util.webidRoot(initiator)}/little-sister/chats/${id}`

    let content = this._conversationTriples(conversation)

    let headers = {'Content-Type': 'text/turtle'}

    return this.http.put(conversation.url, content, headers)
      .then(() => {
        return Promise.all([initiator].concat(participants).map((p) =>
          this._linkConversation(conversation.url, p)
        ))
      })
      .then(() => {
        return this._writeConversationAcl(conversation)
      })
      .then(() => {
        return conversation
      })
  }

  _linkConversation(url, webId) {
    const inbox = `${Util.webidRoot(webId)}/little-sister/inbox`

    const writer = new Writer()

    writer.add('#inbox', PRED.spaceOf, $rdf.literal(url))

    return this.http.patch(inbox, null, writer.all())
  }

  _conversationTriples({url, initiator, participants, subject, created}) {
    let writer = new Writer()

    let thread = $rdf.sym(`${url}#thread`)

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
      object: thread
    }, {
      subject: thread,
      predicate: PRED.type,
      object: PRED.Thread
    }, {
      subject: thread,
      predicate: PRED.hasOwner,
      object: $rdf.sym(initiator)
    }, {
      subject: thread,
      predicate: PRED.created,
      object: $rdf.lit(created.getTime(), undefined, XSD('int'))
    }]

    writer.addAll(triples)

    writer.addTriple({
      subject: thread,
      predicate: PRED.hasSubscriber,
      object: $rdf.sym(initiator)
    })

    // Participant list
    for (let p of participants) {
      writer.addTriple({
        subject: thread,
        predicate: PRED.hasSubscriber,
        object: $rdf.sym(p)
      })
    }

    return writer.end()
  }

  _writeConversationAcl({url, initiator, participants = []}) {
    const writer = new Writer()
    const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    const aclUri = `${url}.acl`
    const owner = $rdf.sym(`${url}#owner`)
    const participant = $rdf.sym(`${url}#participant`)
    const headers = {
      'Content-Type': 'text/turtle'
    }

    writer.addTriple(owner, PRED.type, ACL('Authorization'))
    writer.addTriple(owner, ACL('accessTo'), $rdf.sym(url))
    writer.addTriple(owner, ACL('accessTo'), $rdf.sym(aclUri))
    writer.addTriple(owner, ACL('agent'), $rdf.sym(initiator))
    writer.addTriple(owner, ACL('mode'), ACL('Control'))
    writer.addTriple(owner, ACL('mode'), ACL('Read'))
    writer.addTriple(owner, ACL('mode'), ACL('Write'))

    writer.addTriple(participant, PRED.type, ACL('Authorization'))
    writer.addTriple(participant, ACL('accessTo'), $rdf.sym(url))
    writer.addTriple(participant, ACL('mode'), ACL('Read'))
    writer.addTriple(participant, ACL('mode'), ACL('Write'))

    participants.forEach((webId) => {
      writer.addTriple(participant, ACL('agent'), $rdf.sym(webId))
    })

    return this.http.put(aclUri, writer.end(), headers)
      .then(() => {
        return aclUri
      }).catch((e) => {
        console.error(e, 'occured while putting the acl file')
      })
  }

  getInboxConversations(webId) {
    let inbox = `${Util.webidRoot(webId)}/little-sister/inbox`

    return this.http.get(inbox)
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

  /**
   * Returns relevant conversation metadata
   * @param {String} conversationUrl conversation resource url
   * @return {Object} conversation meta:
   * id, updatesVia, participants, lastMessage
   */
  getConversation(conversationUrl, myUri) {
    let result = {
      id: conversationUrl.replace(/^.*\/chats\/([a-z0-9]+)$/i, '$1'),
      uri: conversationUrl
    }
    return this.http.get(conversationUrl)
      .then((response) => {
        result.updatesVia = response.headers.get('updates-via')
        return response.text().then((text) => {
          return new Parser(text, conversationUrl)
        })
      })
      .then((parsed) => {
        return Promise.all([
          this._parseConversation(parsed, conversationUrl),
          // store this in the conversation rdf
          this._lastMessage(conversationUrl),
          this._getParticipants(parsed, conversationUrl)
        ])
      })
      .then(([conversation, lastMessage, participants]) => {
        return Object.assign(result, conversation, {
          lastMessage,
          participants
        })
      })
      .catch((e) => {
        console.error('Failed to load conversation', e, conversationUrl)
      })
  }

  _parseConversation(parsed, conversationUrl) {
    const subject = parsed.get(undefined, PRED.title, undefined)
    const owner = parsed.get(undefined, PRED.maker, undefined)
    const created = parsed.get(undefined, PRED.created, undefined)

    return {
      subject: subject && subject.object.value,
      owner: owner && owner.object.value,
      created: created && new Date(parseInt(created.object.value))
    }
  }

  getConversationMessages(conversationUrl) {
    return this.http.get(conversationUrl)
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
              id: curr.toString().replace('#', '')
            }
          }
          for (var t of result.triples) {
            if (t.subject !== curr) {
              continue
            }
            if (t.predicate.uri === PRED.content.uri) {
              acc[curr].content = t.object.value
            }
            if (t.predicate.uri === PRED.created.uri) {
              acc[curr].created = new Date(
                parseInt(t.object.value)
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

  // @TODO should be handled in the store, and loaded from state
  getParticipantData(uri) {
    return this.http.get(uri)
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

        result.webId = uri

        return result
      })
  }

  _getMessageTriples({id, conversationId, author, content, created}) {
    id = `#${id}`

    if (created instanceof Date) {
      created = created.getTime()
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
      object: $rdf.lit(content)
    }, { // with timestamp...
      subject: id,
      predicate: PRED.created,
      object: $rdf.lit(created, undefined, XSD('int'))
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

  postMessage(uri, message) {
    const conversationId = `${uri}#thread`

    message = Object.assign({
      id: Util.randomString(5),
      conversationId,
      author: null,
      content: null,
      created: new Date()
    }, message)

    return this.http.get(uri).then((response) => {
      // store this in memory, so we dont need to fetch all data everytime
      return response.text().then((text) => {
        return new Parser(text, conversationId)
      })
    }).then((conversation) => {
      const writer = new Writer()

      writer.addAll(this._getMessageTriples(message))

      return this.http.patch(uri, null, writer.all()).then(() => {
        const participants = conversation.find(
          $rdf.sym(conversationId),
          PRED.hasSubscriber,
          undefined
        ).map((t) => {
          return t.object.value
        })

        return this.notifyParticipants(participants, message)
      })
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
      const id = subject.toString().replace('#', '')

      let message = {
        id
      }

      for (let field in schema) {
        let value = g.any(subject, schema[field])
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
    return this.http.get(container)
      .then((response) => {
        return response.text().then((text) => {
          return new Parser(text, webId)
        })
      })
      .then((g) => {
        const ids = g.find(undefined, PRED.type, SOLID.Notification)

        return ids.map(({subject}) => {
          return subject.toString().replace('#', '')
        })
      })
  }

  getUnreadMessages(webId) {
    let container = this.getUnreadMessagesContainer(webId)
    return this.http.get(container)
      .then((response) => {
        return response.text().then((text) => {
          return new Parser(text, webId)
        })
      })
      .then(this._parseMessages)
  }

  notifyParticipants(participants, message) {
    return Promise.all(participants.map((participant) => {
      if (participant !== message.author) {
        return this.addUnreadMessage(participant, message)
      }
    }))
  }

  addUnreadMessage(participant, message) {
    const container = this.getUnreadMessagesContainer(participant)
    const writer = new Writer()

    writer.add(`#${message.id}`, PRED.type, SOLID.Notification)

    writer.addAll(this._getMessageTriples(message))

    return this.http.patch(container, null, writer.all())
  }

  removeUnreadMessage(webId, message) {
    const container = this.getUnreadMessagesContainer(webId)

    const writer = new Writer()

    writer.add(`#${message.id}`, PRED.type, SOLID.Notification)

    writer.addAll(this._getMessageTriples(message))

    return this.http.patch(container, writer.all())
  }

  setSubject(uri, oldSubject, newSubject) {
    const oldTriple = $rdf.st('', PRED.title, $rdf.literal(oldSubject))

    const newTriple = $rdf.st('', PRED.title, $rdf.literal(newSubject))

    return this.http.patch(uri, [oldTriple], [newTriple])
  }

  _getParticipantACLTriple(uri, webId) {
    const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    const subject = $rdf.sym(`${uri}#participant`)

    return $rdf.st(subject, ACL('agent'), $rdf.sym(webId))
  }

  addParticipant(uri, webId) {
    const statements = [$rdf.st(
      $rdf.sym(`${uri}#thread`), PRED.hasSubscriber, $rdf.sym(webId)
    )]
    const acl = this._getParticipantACLTriple(uri, webId)

    return Promise.all([
      this.http.patch(uri, null, statements),
      this.http.patch(`${uri}.acl`, null, [acl])
    ])
  }

  addParticipants(uri, participants) {
    let statements = []
    let acl = []
    participants.forEach((webId) => {
      statements.push($rdf.st(
        $rdf.sym(`${uri}#thread`), PRED.hasSubscriber, $rdf.sym(webId)
      ))
      acl.push(this._getParticipantACLTriple(uri, webId))
    })

    return Promise.all([
      this.http.patch(uri, null, statements),
      this.http.patch(`${uri}.acl`, null, acl)
    ])
  }

  removeParticipant(uri, webId) {
    return Promise.all([
      this.http.patch(uri, [$rdf.st(
        $rdf.sym(`${uri}#thread`), PRED.hasSubscriber, $rdf.sym(webId)
      )]),
      this.http.patch(`${uri}.acl`,
        [this._getParticipantACLTriple(uri, webId)]
      )
    ])
  }

}
