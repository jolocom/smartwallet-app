import {Parser, Writer} from '../rdf'
import LDPAgent from './ldp'
import Util from '../util'
import {DC, FOAF, RDF, SIOC} from '../namespaces.js'
import N3 from 'n3'
import _ from 'lodash'

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
    let conversationDoc = `${this._webidRoot(initiator)}/little-sister/chats/${conversationId}`
    let hdrs = {'Content-type': 'text/turtle'}
    return this._conversationTriples(initiator, participants)
      .then((conversationDocContent) => {
        return this.put(conversationDoc, hdrs, conversationDocContent)
      })
      .then(() => {
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
    console.log(conversationUrl)
    console.log(author)
    console.log(content)
    let msgId = `#${Util.randomString(5)}`
    let conversationId = `${conversationUrl}#thread`
    return this.get(conversationUrl)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((result) => {
        let triples = [{// this is a message
          subject: msgId,
          predicate: RDF.type,
          object: SIOC.Post
        }, { // written by...
          subject: msgId,
          predicate: SIOC.hasCreator,
          object: author
        }, { // with content...
          subject: msgId,
          predicate: SIOC.content,
          object: N3Util.createLiteral(content)
        }, { // with timestamp...
          subject: msgId,
          predicate: DC.created,
          object: N3Util.createLiteral(new Date().getTime())
        }, { // contained by
          subject: msgId,
          predicate: SIOC.hasContainer,
          object: conversationId
        }, {
          subject: conversationId,
          predicate: SIOC.containerOf,
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
        return parser.parse(xhr.response)
      })
      .then((result) => {
        let posts = result.triples.filter((t) => t.predicate == RDF.type && t.object == SIOC.Post) .map((t) => t.subject)
        let groups = posts.reduce((acc, curr) => {
          if (!(curr in acc)) {
            acc[curr] = {}
          }
          for (var t of result.triples) {
            if (t.subject != curr) {
              continue
            }
            if(t.predicate == SIOC.content) {
              acc[curr].content = N3Util.getLiteralValue(t.object)
            }
            if(t.predicate == DC.created) {
              acc[curr].created = new Date(parseInt(N3Util.getLiteralValue(t.object)))
            }
            if(t.predicate == SIOC.hasCreator) {
              acc[curr].author = t.object
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
        return parser.parse(xhr.response)
      })
      .then((parsed) => {
        return Promise.all([this._lastMessage(conversationUrl), this._otherPerson(parsed.triples, conversationUrl)])
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
    let aboutThread = _.filter(triples, (t) => t.subject == '#thread' || t.subject == `${conversationUrl}#thread`)
    let owner = _.find(aboutThread, (t) => t.predicate == SIOC.hasOwner)
    if (owner) {
      owner = owner.object
    }
    let participants = _.map(_.filter(aboutThread, (t) => t.predicate == SIOC.hasSubscriber), (t) => t.object)
    let otherPerson = _.find(participants, (p) => p != owner)
    if (!otherPerson) {
      return Promise.resolve(null)
    }

    let result = {}
    return this.get(otherPerson)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((parsed) => {
        let aboutPerson = _.filter(parsed.triples, (t) => t.subject == otherPerson || t.subject == '#me')

        let name = _.find(aboutPerson, (t) => t.predicate == FOAF.name)
        if (name) {
          result.name = N3Util.getLiteralValue(name.object)
        }

        let img = _.find(aboutPerson, (t) => t.predicate == FOAF.img)
        if (img) {
          result.img = img.object
        }
        result.webid = otherPerson


        return result
      })
  }

  getInboxConversations(webid) {
    let inbox = `${this._webidRoot(webid)}/little-sister/inbox`
    return this.get(inbox)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((result) => {
        return result.triples.filter((t) => t.predicate == SIOC.spaceOf).map((t) => t.object)
      })
  }

  _linkConversation(conversationUrl, webid) {
    let inbox = `${this._webidRoot(webid)}/little-sister/inbox`
    return this.get(inbox)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((result) => {
        let writer = new Writer({prefixes: result.prefixes})
        let link = {
          subject: '#inbox',
          predicate: SIOC.spaceOf,
          object: conversationUrl
        }
        result.triples.push(link)
        for (var t of result.triples) {
          writer.addTriple(t)
        }
        return writer.end()
      })
      .then((updatedInbox) => {
        let hdrs = {'Content-type': 'text/turtle'}
        return this.put(inbox, hdrs, updatedInbox)
      })
  }

  _webidRoot(webid) {
    return webid.match(/^(.*)\/profile\/card#me$/)[1]
  }

  _conversationTriples(initiator, participants) {
    let writer = new Writer()

    let triples = [
        {
          subject: '',
          predicate: DC.title,
          object: N3Util.createLiteral(`Conversation created by ${initiator}`)
        },
        {
          subject: '',
          predicate: FOAF.maker,
          object: initiator
        },
        {
          subject: '',
          predicate: FOAF.primaryTopic,
          object: '#thread'
        },
        {
          subject: '#thread',
          predicate: RDF.type,
          object: SIOC.Thread
        },
        {
          subject: '#thread',
          predicate: SIOC.hasOwner,
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
        predicate: SIOC.hasSubscriber,
        object: p
      })
    }

    return writer.end()
  }

}

export default ChatAgent
