import React from 'react'

import Util from 'lib/util'

let PlusDrawer = React.createClass({

  getInitialState: function() {
    return {
      title: '',
      description: ''
    }
  },

  componentDidMount: function() {
    console.log('PlusDrawer component did mount')
    let state = {
      title: this.state.title,
      description: this.state.description
    }
    this.setState(state)
  },

  toInbox: function() {

    this.props.toggle()
    this.props.addNodeToInbox({
      title: this.state.title,
      description: this.state.description,
      newNode: true
    })
  },

  directConnect: function() {
    console.log(this.state)
    this.props.addNode({
      title: this.state.title,
      description: this.state.description,
      newNode: true
    })
    this.props.toggle()
  },

  render: function() {
    return (
      <div id="plus_drawer">
        <div className="close" onClick={this.props.toggle}>x</div>
        <div>
          <textarea className="title" placeholder="Node title" rows="1" cols="50" onChange={Util.linkToState(this, 'title')}/>
        </div>
        <div>
          <textarea className="description" placeholder="Node description" rows="5" cols="50" onChange={Util.linkToState(this, 'description')}/>
        </div>
        <div className="button direct" onClick={this.directConnect}>Connect Now</div>
        <div className="button inbox" onClick={this.toInbox}>Put Into Inbox</div>
      </div>
    )
  }
})

export default PlusDrawer
