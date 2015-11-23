// This component is only meant for test purposes
import React from 'react'
import WebIDAgent from 'lib/agents/webid.js'
import ChatAgent from 'lib/agents/chat.js'
import {Button} from 'react-mdl'

import {linkToState} from 'lib/util'

/*
 - on reload it creates 4 identities
 - you can choose to create a conversation between any of them
 - you can choose to post a message to conversation by any of the participants
*/

let testIdentities = [
    {
      username: 'justas',
      name: 'Justas',
      email: 'justas@gmail.com'
    },
    {
      username: 'eelco',
      name: 'Eelco',
      email: 'eelco@gmail.com'
    },
    {
      username: 'joachim',
      name: 'Joachim',
      email: 'joachim@gmail.com'
    },
    {
      username: 'christian',
      name: 'Christian',
      email: 'christian@gmail.com'
    }
]

let wia = new WebIDAgent()
let chatAgent = new ChatAgent()
let ChatTest = React.createClass({
  getInitialState: function() {
    return {
      conversationUrl: null,
      conversationToLoad: null,
      threads: [],
      messages: [],
      inboxId: null,
      participants: testIdentities[0].username,
      author: testIdentities[0].username,
      message: '',
      testDataPrepared: false
    }
  },
  // just for testing, to refresh dataset
  _recreateUser: function(username, name, email) {
    let webidContainer = `https://localhost:8443/${username}`
    return wia.delete(webidContainer)
      .catch(() => true) //this doesn't work
      .then(() => wia.fakeSignup(username, name, email))
  },

  componentDidMount: function() {
    return Promise.all(testIdentities.map((i) => this._recreateUser(i.username, i.name, i.email)))
      .then(() => {
        console.log('prepared test data.')
        this.setState({
          conversationUrl: this.state.conversationUrl,
          conversationToLoad: this.state.conversationToLoad,
          threads: this.state.threads,
          messages: this.state.messages,
          inboxId: this.state.inboxId,
          participants: this.state.participants,
          author: this.state.author,
          message: this.state.message,
          testDataPrepared: true
        })

      })
  },
  onCreateConversationClick: function() {
    console.log('Creating conversation...')
    console.log(this.state.participants)
    let participants = this.state.participants.split(',').map((username) => `https://localhost:8443/${username}/profile/card#me`)
    let initiator = participants[0]
    chatAgent.createConversation(initiator, participants)
      .then((conversationUrl) => {
        console.log('conversation created')
        console.log(initiator)
        console.log(participants)
        this.setState({
          conversationUrl: conversationUrl,
          conversationToLoad: conversationUrl,
          threads: this.state.threads,
          messages: this.state.messages,
          inboxId: this.state.inboxId,
          participants: this.state.participants,
          author: this.state.author,
          message: this.state.message,
          testDataPrepared: this.state.testDataPrepared
        })
      })

    //TODO: create conversation resource and link it to all participant inboxes
  },

  onPostClick: function() {
    console.log(`Post message ${this.state.message} as ${this.state.author}`)

    let author = `https://localhost:8443/${this.state.author}/profile/card#me`

    return chatAgent.postMessage(this.state.conversationUrl, author, this.state.message)
      .then(() => {
        console.log('posted message')
      })

  },

  onInboxLoadClick: function() {
    console.log(`Loading inbox ${this.state.inboxId} ...`)
    return chatAgent.getInboxConversations(`https://localhost:8443/${this.state.inboxId}/profile/card#me`)
      .then((conversations) => {
        this.setState({
          conversationUrl: this.state.conversationUrl,
          conversationToLoad: this.state.conversationToLoad,
          threads: conversations,
          messages: this.state.messages,
          inboxId: this.state.inboxId,
          participants: this.state.participants,
          author: this.state.author,
          message: this.state.message,
          testDataPrepared: this.state.testDataPrepared
        })
      })
  },

  onLoadThreadClick: function() {
    console.log(`Loading thread ${this.state.conversationToLoad} ...`)
    return chatAgent.getConversationMessages(this.state.conversationToLoad)
      .then((messages) => {
        console.log(messages)
        this.setState({
          conversationUrl: this.state.conversationUrl,
          conversationToLoad: this.state.conversationToLoad,
          threads: this.state.threads,
          messages: messages,
          inboxId: this.state.inboxId,
          participants: this.state.participants,
          author: this.state.author,
          message: this.state.message,
          testDataPrepared: this.state.testDataPrepared
        })
      })
  },

  render: function() {
    let testDataText = this.state.testDataPrepared ? 'Test data prepared.' : 'Preparing test data'
    return (
      <div className="profile">
        <span>Available participants: </span>
        {testIdentities.map(function(i) {
          return (
            <div><b key={i.email}>{i.username}</b><br/></div>
          )
        })}

        <span>Enter comma separated participants:</span>
        <input type="text" onChange={linkToState(this, 'participants')}></input>
        <br/>
        <span>{testDataText}</span>
        <br/>
        <span>{this.state.conversationUrl}</span>
        <br/>
        <Button onClick={this.onCreateConversationClick}>
          Create conversation
        </Button>
        <br/>
        <span>Author</span>
        <br/>
        <input type="text" onChange={linkToState(this, 'author')}></input>
        <br/>
        <span>Message</span>
        <br/>
        <input type="text" onChange={linkToState(this, 'message')}></input>
        <br/>

        <Button onClick={this.onPostClick}>
          Post
        </Button>

        <br/>
        <input type="text" onChange={linkToState(this, 'inboxId')}></input>
        <br/>
        <Button onClick={this.onInboxLoadClick}>
          Load Inbox
        </Button>
        <br/>
        <span>Threads: </span>
        {this.state.threads.map(function(t, index) {
          return (
            <div><b key={index}>{t}</b><br/></div>
          )
        })}
        <br/>

        <br/>
        <input type="text" onChange={linkToState(this, 'conversationToLoad')}></input>
        <br/>
        <span>Messages: </span>
        {this.state.messages.map(function(m, index) {
          return (
            <div><b key={index}>{m.created} {m.author} says: {m.content}</b><br/></div>
          )
        })}
        <br/>
        <Button onClick={this.onLoadThreadClick}>
          Load Thread
        </Button>
      </div>
    )
  }
})

export default ChatTest
