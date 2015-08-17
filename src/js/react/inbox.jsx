import React from 'react/addons'

export let InboxCounter = React.createClass({
  getInitialState: function() {
    return {
      count: this.props.count ? this.props.count : 0,
    }
  },
  componentWillReceiveProps: function(nextProps) {
    console.log('InboxCounter component will receive props')
    let state = {
      count: nextProps.count,
    }
    this.setState(state)
  },
  render: function() {
    //<div id="inbox" draggable="true" onClick={this.inboxEnlarge}>
    return (
      <div id="inbox" draggable="true" onClick={this.props.onClick}>
        <div className="counter">
          <div className="number">{this.state.count}</div>
        </div>
      </div>
    )
  
  }
})

export let Inbox = React.createClass({
  getInitialState: function() {
    return {
      nodes: this.props.nodes ? this.props.nodes : [],
      open: false
    }
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('Inbox component will receive props')
    let state = {
      nodes: nextProps.nodes,
    }
    this.setState(state)
  },


  onNodeClick: function(nodeId) {
    self = this
    return function(e) {
      console.log(`node ${nodeId} clicked`)
      // FIXME: unreliable
      let node = self.state.nodes[nodeId - 1]
      self.props.addNode(node)
    }
  },

  render: function() {
    let onNodeClick = this.onNodeClick
    return (
        <div id="inbox_large" onClick={this.props.onClick}>
          {this.state.nodes.map(function(node) {
            return (
              <div className="element" key={node.id}>
                <div className="node" onClick={onNodeClick(node.id)}></div>
                <div className="title"></div>
              </div>
            )
          })}
          <div className="close">x</div>
        </div>
    )
  },
})
