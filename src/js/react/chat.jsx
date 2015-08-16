import React from 'react/addons'
import d3 from 'd3'
import STYLES from './styles.js'

class ChatD3 {
  constructor(el, props) {
    d3.select( "#chat" )
  	.transition()
  	.style( "top", ( STYLES.height / 3 )+ "px")
    props.graph.zoomTo( 0.5,
      STYLES.width / 2,
      STYLES.height / -6 )
      console.log('chat after load')
      return false
  }


  destroy(props) {
    d3.select( "#chat" )
      .transition()
      .style( "top", STYLES.height + "px")
    props.graph.zoomReset()
  }
}

let Chat = React.createClass({
  getInitialState: function() {
    return {
      chatD3: null,
    }
  },

  componentDidMount: function() {
    console.log('Chat component did mount')
    let state = {
      chatD3: new ChatD3(null, this.props),
    }
    this.setState(state)
  },

  componentWillUnmount: function() {
    console.log('Chat component will unmount')
    this.state.chatD3.destroy(this.props)
  },

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
