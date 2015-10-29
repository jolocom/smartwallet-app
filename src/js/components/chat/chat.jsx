import React from 'react'

import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'

import List, {ListItem} from 'components/common/list.jsx'
import Avatar from 'components/common/avatar.jsx'

import TimerMixin from 'react-timer-mixin'
import N3 from 'n3'
import HTTPAgent from 'lib/agents/http.js'
import Util from 'lib/util.js'
import {Parser, Writer} from 'lib/rdf.js'
import {DC, RDF, SIOC} from 'lib/namespaces.js'

let N3Util = N3.Util
let http = new HTTPAgent()

// const CHAT_RELOAD_INTERVAL = 4000 // 4 seconds

let Chat = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      messages: [],
      currentMessage: '',
      topic: this.props.topic,
      origin: this.props.origin,
      identity: this.props.identity
    }
  },

  // TODO: should rewrite this terrible bullshit
  _loadMessages: function(origin) {
    let res = null

    // fetch commen subject
    return http.get(origin)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((tmp) => {
        res = tmp
        // see what it contains
        let containerOf = res.triples.filter((t) => t.predicate == SIOC.containerOf).map((t) => t.object)
        // .. and fetch the contained object docs
        return Promise.all(containerOf.map((c) => http.get(Util.urlWithoutHash(c))))
      })
      .then((results) => {
        // parse fetched docs
        return Promise.all(results.map((xhr) => {
          let parser = new Parser()
          return parser.parse(xhr.response)
        }))
      })
      .then((parsedResults) => {
        // put parsed results together with chat subject data
        res = parsedResults.reduce((acc, curr) => {
          acc.triples = acc.triples.concat(curr.triples)
          return acc
        }, res)

        // group objects by subject and predicate
        let graphs = res.triples.reduce((acc, t) => {
          if (!(t.subject in acc)) {
            acc[t.subject] = {}
          }
          if (!(t.predicate in acc[t.subject])) {
            acc[t.subject][t.predicate] = []
          }

          acc[t.subject][t.predicate].push(t.object)
          return acc
        }, {})

        // origin graph contains the graphs with these subjects
        let contains = graphs[origin][SIOC.containerOf] != undefined ? graphs[origin][SIOC.containerOf] : []

        let msgs = []
        for (var subj of contains) {
          if (!graphs.hasOwnProperty(subj) || !graphs[subj].hasOwnProperty(RDF.type)) {
            // does not exist or type not set
            console.log('does not exist or type not set')
            continue
          }
          if (graphs[subj][RDF.type].indexOf(SIOC.Post) == -1) {
            // not a Post
            console.log('not a Post')
            continue
          }

          let authors = graphs[subj][SIOC.hasCreator]
          let contents = graphs[subj][SIOC.content]
          let replies = graphs[subj][SIOC.hasReply]
          let timestamps = graphs[subj][DC.created]

          msgs.push({
            id: subj,
            author: authors[0],
            content: N3Util.getLiteralValue(contents[0]),
            reply: (replies != undefined && replies.length != 0) ? replies[0] : null,
            created: timestamps[0]
          })
        }

        // sort messages by timestamps
        msgs.sort((a, b) => new Date(a.created) - new Date(b.created))

        return msgs
      })
  },

  componentDidMount: function() {
    //
    // // initialize interval for reloading
    // this.setInterval(() => {
    //   console.log('tick...')
    //   this._loadMessages(this.state.origin)
    //     .then((messages) => {
    //       let state = {
    //         messages: messages,
    //         currentMessage: this.state.currentMessage,
    //         topic: this.state.topic,
    //         origin: this.state.origin,
    //         identity: this.state.identity
    //       }
    //       this.setState(state)
    //     })
    // }, CHAT_RELOAD_INTERVAL)
    //
    // // initial message loading
    // this._loadMessages(this.state.origin)
    //   .then((messages) => {
    //     let state = {
    //       messages: messages,
    //       currentMessage: this.state.currentMessage,
    //       topic: this.state.topic,
    //       origin: this.state.origin,
    //       identity: this.state.identity
    //     }
    //     this.setState(state)
    //   })
  },

  _commentContainerForIdentity: function(identity) {
    let identityRoot = identity.match(/^(.*)\/profile\/card#me$/)[1]
    let cont =  `${identityRoot}/little-sister/graph-comments/`
    return cont
  },

  newMsgTriples: function(subject, author, content, msgDocUrl) {
    let msgUrl = `${msgDocUrl}#post`

    let msgDocTriples = [{// this is a message
      subject: msgUrl,
      predicate: RDF.type,
      object: SIOC.Post
    }, { // written by...
      subject: msgUrl,
      predicate: SIOC.hasCreator,
      object: author
    }, { // with content...
      subject: msgUrl,
      predicate: SIOC.content,
      object: N3Util.createLiteral(content)
    }, { // with timestamp...
      subject: msgUrl,
      predicate: DC.created,
      object: N3Util.createLiteral(new Date().toUTCString())
    }]

    let subjectDocTriples = [{ // this node is related to this comment
      subject: subject,
      predicate: SIOC.containerOf,
      object: msgUrl
    }, {
      subject: msgUrl,
      predicate: RDF.type,
      object: SIOC.Post
    }]

    return {
      message: msgDocTriples,
      subject: subjectDocTriples
    }
  },

  onMessageSendClick: function() {
    let msgContainer = this._commentContainerForIdentity(this.state.identity)
    let msgSlug = Util.randomString(5)
    let newMsgDocUrl = `${msgContainer}${msgSlug}`

    return http.get(this.state.origin)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((res) => {
        let msgWriter = new Writer({format: 'N-Triples'})
        let subjectWriter = new Writer({format: 'N-Triples', prefixes: res.prefixes})

        // add old triples
        for (var t of res.triples) {
          subjectWriter.addTriple(t)
        }

        // add triples representing new message
        let newMsg = this.newMsgTriples (this.state.origin, this.state.identity, this.state.currentMessage, newMsgDocUrl)

        for (t of newMsg.message) {
          msgWriter.addTriple(t)
        }
        for (t of newMsg.subject) {
          subjectWriter.addTriple(t)
        }

        return Promise.all([msgWriter.end(), subjectWriter.end()])
      })
      .then((results) => {
        let messageDoc = results[0]
        let subjectDoc = results[1]

        let createMsg = http.post(msgContainer, {'Slug': msgSlug, 'Accept': 'application/n-triples', 'Content-type': 'application/n-triples'}, messageDoc)
        let updateSubject = http.put(this.state.origin, {'Content-type': 'application/n-triples'}, subjectDoc)
        return Promise.all([createMsg, updateSubject])
      })
      .then(() => {
        // now load new messages
        return this._loadMessages(this.state.origin)
      })
      .then((messages) => {
        let state = {
          messages: messages,
          currentMessage: '',
          topic: this.state.topic,
          origin: this.state.origin,
          identity: this.state.identity
        }
        this.setState(state)
      })
  },

  render: function() {
    return (
      <div className="jlc-chat">
        { /* TODO: structure, ids and class names suck*/ }
        <List className="jlc-chat-list">
          {this.state.messages.map(({author, content}) => {
            let avatar = <Avatar src={author.imgUri}>{author.name[0]}</Avatar>
            return (
              <ListItem title={author.name} content={content} leftIcon={avatar}/>
            )
          })}
        </List>
        <FabMenu>
          <FabMenuItem icon="chat" label="Conversation" href="#/chat/new"/>
          <FabMenuItem icon="group_add" label="Group chat"/>
        </FabMenu>

        {this.props.children}
      </div>
    )
  }
})

export default Chat
