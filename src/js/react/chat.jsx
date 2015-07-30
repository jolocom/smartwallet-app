import React from 'react'

class Chat extends React.Component {
  render() {
    return (
      <div id="chat">
        { /* TODO: structure, ids and class names suck*/ }
        <div className="close">x</div>
        <div className="head">
          <h1 className="title">TODO: chat topic goes here</h1>
          <p className="origin">TODO: chat origin goes here</p>
          <div className="message">
            <div className="content">
              <h2>TODO: author goes here</h2>
              <p>TODO: content goes here</p>
            </div>
            <div className="node link"/>
          </div>
          <div className="message">
            <div className="content">
              <h2>TODO: author goes here</h2>
              <p>TODO: content goes here</p>
            </div>
            <div className="node link"/>
          </div>
          <div className="message">
            <div className="content">
              <h2>TODO: author goes here</h2>
              <p>TODO: content goes here</p>
            </div>
            <div className="node link"/>
          </div>
        </div>
        <div className="message new">
          <textarea className="content" value="TODO: Current message"/>
          <div className="node link"/>
          <div className="button">tell</div>
        </div>
      </div>
    )
  }
}


export default Chat
