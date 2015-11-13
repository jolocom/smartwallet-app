import {Parser, Writer} from '../rdf'
import LDPAgent from './ldp'
import Util from '../util'
import {DC, FOAF, RDF, SIOC} from '../namespaces.js'
import N3 from 'n3'

let N3Util = N3.Util

// Chat related functions
class ChatAgent extends LDPAgent {
  createConversation(initiator, participants) {
    // POST conversation to initiators container
    // update inbox indices of all participants
    //
    console.log(participants)
    let conversationId = Util.randomString(5)
    let conversationDoc = `${this._webidRoot(initiator)}/little-sister/chats/${conversationId}`
    let hdrs = {'Content-type': 'text/turtle'}
    return this._conversationTriples(initiator)
      .then((conversationDocContent) => {
        console.log(conversationDocContent)
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
          object: N3Util.createLiteral(new Date().toUTCString())
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
              acc[curr].created = N3Util.getLiteralValue(t.object)
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
        msgs.sort((a, b) => new Date(a.created) - new Date(b.created))

        return msgs
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

  _conversationTriples(initiator) {
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
        }
    ]

    for (var t of triples) {
      writer.addTriple(t)
    }

    return writer.end()
  }

}

export default ChatAgent
