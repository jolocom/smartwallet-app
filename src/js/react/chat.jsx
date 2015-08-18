import React from 'react/addons'
import TimerMixin from 'react-timer-mixin'
import N3 from 'n3'
import WebAgent from '../lib/web-agent.js'
import Util from '../lib/util.js'
import {Parser, Writer} from '../lib/rdf.js'
import {DC, RDF, SIOC} from '../lib/namespaces.js'

let N3Util = N3.Util

const CHAT_RELOAD_INTERVAL = 4000 // 4 seconds

let Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <div className="content">
          <h2>{this.props.author}</h2>
          <p>{this.props.content}</p>
        </div>
        <div className="node link"/>
      </div>
    )
  }
})

let Chat = React.createClass({
  mixins: [React.addons.LinkedStateMixin, TimerMixin],

  getInitialState: function() {
    return {
      messages: [],
      currentMessage: '',
      topic: this.props.topic,
      origin: this.props.origin,
      identity: this.props.identity,
    }
  },

  // TODO: rewrite with lodash?
  _loadMessages: function(origin) {
    return WebAgent.get(origin)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((res) => {
        console.log('chat parsed')

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

        console.log(graphs)

        // origin graph contains the graphs with these subjects
        let contains = graphs[origin][SIOC.containerOf] != undefined ? graphs[origin][SIOC.containerOf] : []

        let msgs = []
        for (var subj of contains) {
          console.log(subj)
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
            content: contents[0],
            reply: (replies != undefined && replies.length != 0) ? replies[0] : null,
            created: timestamps[0]
          })
        }

        //TODO: sort by reply chain?

        return msgs
      })
  },

  componentDidMount: function() {

    // initialize interval for reloading
    this.setInterval(() => {
      console.log('tick...')
      this._loadMessages(this.state.origin)
        .then((messages) => {
          let state = {
            messages: messages,
            currentMessage: this.state.currentMessage,
            topic: this.state.topic,
            origin: this.state.origin,
            identity: this.state.identity
          }
          this.setState(state)
        })
    }, CHAT_RELOAD_INTERVAL)

    // initial message loading
    this._loadMessages(this.state.origin)
      .then((messages) => {
        let state = {
          messages: messages,
          currentMessage: this.state.currentMessage,
          topic: this.state.topic,
          origin: this.state.origin,
          identity: this.state.identity
        }
        this.setState(state)
      })
  },

  newMsgTriples: function(subject, author, content) {
    let msgUrl = `${Util.urlWithoutHash(subject)}#${Util.randomString(5)}`
    console.log('msg url')
    console.log(msgUrl)

    return [
      {// this is a message
        subject: msgUrl,
        predicate: RDF.type,
        object: SIOC.Post
      },
      { // in relation to...
        subject: subject,
        predicate: SIOC.containerOf,
        object: msgUrl
      },
      { // written by...
        subject: msgUrl,
        predicate: SIOC.hasCreator,
        object: author
      },
      { // with content...
        subject: msgUrl,
        predicate: SIOC.content,
        object: N3Util.createLiteral(content)
      },
      { // with timestamp...
        subject: msgUrl,
        predicate: DC.created,
        object: N3Util.createLiteral(new Date().toUTCString())
      },
    ]
  },

  onMessageSendClick: function(e) {
    console.log('send msg')
    console.log(this.state.currentMessage)
    return WebAgent.get(this.state.origin)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((res) => {
        let writer = new Writer({format: 'N-Triples', prefixes: res.prefixes})
        // add old triples
        for (var t of res.triples) {
          writer.addTriple(t)
        }

        // add triples representing new message
        let newMsg = this.newMsgTriples (this.state.origin, this.state.identity, this.state.currentMessage)
        console.log(newMsg)
        for (var t of newMsg) {
          writer.addTriple(t)
        }

        return writer.end()
      })
      .then((res) => {
        console.log('resulting triples: ')
        console.log(res)
        console.log('now send...')
        return WebAgent.put(this.state.origin, {'Content-type': 'application/n-triples'}, res)
      })
      .then((xhr) => {
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
      <div id="chat_container">
        <div id="chat">
          { /* TODO: structure, ids and class names suck*/ }
          <div className="close" onClick={this.props.hide}>x</div>
          <div className="head">
            <h1 className="title">{this.props.topic}</h1>
            <p className="origin">{this.props.origin}</p>
          </div>

          {this.state.messages.map(function(msg) {
            return (
              <Message key={msg.id} author={msg.author} content={msg.content}/>
            )
          })}

          <div className="message new">
            <textarea className="content" valueLink={this.linkState('currentMessage')}/>
            <div className="node link"/>
            <div className="button" onClick={this.onMessageSendClick}>tell</div>
          </div>
        </div>
      </div>
    )
  }
})

export default Chat
