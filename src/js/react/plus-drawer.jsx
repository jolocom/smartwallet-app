import React from 'react/addons'
import d3 from 'd3'
import STYLES from './styles.js'

class PlusDrawerD3 {
  constructor(el, props, state) {
    this.props = props

    document.getElementsByTagName('body')[0].className = 'open-drawer'
    d3.select("#plus_drawer")
      .transition()
      .style( "top", ( STYLES.height / 2 )+"px" )

    this.props.graph.zoomTo( 0.5,
             STYLES.width / 2,
             0 )
  }

  destroy() {
    document.getElementsByTagName('body')[0].className = 'closed-drawer'
    d3.select("#plus_drawer")
      .transition()
      .style( "top", STYLES.height+"px" )
    this.props.graph.zoomReset()
  }
}

let PlusDrawer = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      plusD3: null,
      title: '',
      description: ''
    }
  },

  componentDidMount: function() {
    console.log('PlusDrawer component did mount')
    let state = {
      plusD3: new PlusDrawerD3(null, this.props, this.state),
      title: this.state.title,
      description: this.state.description
    }
    this.setState(state)
  },

  componentWillUnmount: function() {
    console.log('PlusDrawer component will unmount')
    this.state.plusD3.destroy()
  },

  toInbox: function() {

    this.props.toggle()
    this.props.addNodeToInbox({ 
      title: this.state.title,
      description: this.state.description 
    })
  },

  directConnect: function() {
    console.log(this.state)
    this.props.addNode({ 
      title: this.state.title,
      description: this.state.description 
    })
    this.props.toggle()
  },

  render: function() {
    return (
      <div id="plus_drawer">
        <div className="close" onClick={this.props.toggle}>x</div>
        <div>
          <textarea className="title" placeholder="Node title" rows="1" cols="50" valueLink={this.linkState('title')}/>
        </div>
        <div>
          <textarea className="description" placeholder="Node description" rows="5" cols="50" valueLink={this.linkState('description')}/>
        </div>
        <div className="button direct" onClick={this.directConnect}>Connect Now</div>
        <div className="button inbox" onClick={this.toInbox}>Put Into Inbox</div>
      </div>
    )
  }
})

export default PlusDrawer
