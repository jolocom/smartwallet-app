import React from 'react/addons'

let Chat = React.createClass({
  render: function() {
    return (
      <div id="chat_container">
        <div id="chat">
          { /* TODO: structure, ids and class names suck*/ }
          <div className="close" onClick={this.props.hide}>x</div>
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
            <div className="button" onClick={this.hide}>tell</div>
          </div>
        </div>
      </div>
    )
  }
})

export default Chat
