import React from 'react/addons'
import STYLES from './styles.js'
import d3 from 'd3'

class InboxD3 {
  enlarge(props){
    console.log(props)
    props.graph.zoomTo( 0.5,
             STYLES.width / 2,
             STYLES.height )
    d3.select( "#inbox" )
      .transition()
      .style( "right", ( -STYLES.width / 2 )+"px")
  }
  reduce(props){
    props.graph.zoomReset()
  }

  close(){
    //let size = (self.inbox.count==0)
      //?(-STYLES.width)
      //:(-STYLES.width+(STYLES.width/5))

    let size = -STYLES.width + (STYLES.width/5)

    d3.select( "#inbox" )
      .transition()
      .style( "right", size+"px" )
  }

  fadeIn() {
    console.log('fade in inbox')
    d3.select( "#inbox .counter" )
      .transition()
      .style( "opacity", 1 )
  }

}

let Inbox = React.createClass({
  getInitialState: function() {
    return {
      inboxD3: null, //TODO: should store this in initial props instead
      nodes: [],
      open: false
    }
  },

  componentDidMount: function() {
    console.log('Inbox component did mount')
    let state = {
      inboxD3: new InboxD3(null, this.props, this.state),
      nodes: this.state.nodes,
      open: this.state.open
    }
    this.setState(state)
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('Inbox component will receive props')
    console.log(this.props)
    console.log(nextProps)
    let state = {
      nodes: nextProps.nodes,
      open: nextProps.open
    }
    this.setState(state)
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log('Inbox component did update')
    if( this.state.nodes.length == 1 ){ // fade in on first node
      this.state.inboxD3.fadeIn()
    }

    //spring
    if (this.state.nodes.length >= 1) {
      console.log('spring inbox')
      this.state.inboxD3.close()
    }

    // was closed- now open
    if (!prevState.open && this.state.open) {
      this.state.inboxD3.enlarge(this.props)
    }

    // was open - now closed
    if (prevState.open && !this.state.open) {
      this.state.inboxD3.reduce(this.props)
    }
  },

  componentWillUnmount: function() {
    console.log('Inbox component will unmount')
  },

  inboxEnlarge: function() {
    let state = {
      inboxD3: this.state.inboxD3,
      nodes: this.state.nodes,
      open: true
    }
    this.setState(state)
  },

  inboxReduce: function() {
    let state = {
      inboxD3: this.state.inboxD3,
      nodes: this.state.nodes,
      open: false
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
      <div id="inbox_container">
        <div id="inbox" draggable="true" onClick={this.inboxEnlarge}>
          <div className="counter">
            <div className="number">{this.state.nodes.length}</div>
          </div>
        </div>

        { this.state.open ?
        <div id="inbox_large" onClick={this.inboxReduce}>
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
        :
        ""
        }
      </div>
    )
  },
})

export default Inbox
