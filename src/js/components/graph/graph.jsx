// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances. It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import PinnedNodes from './pinned.jsx'
import GraphStore from '../../stores/graph-store'
import graphActions from '../../actions/graph-actions'

let Graph = React.createClass({

  mixins : [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  contextTypes: {
    history: React.PropTypes.object,
    username: React.PropTypes.string
  },

  childContextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.string
  },

  getChildContext: function() {
    return {
      node: this.state.center,
      user: this.state.user
    }
  },

  getGraphEl: function() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate: function(data, signal) {
    if (data) this.setState(data)

    if (!this.state.loaded && this.context.username) {
      graphActions.getInitialGraphState(this.context.username)
    }

    if (this.state.loaded && !this.state.drawn){
      this.graph.render(this.state)
      graphActions.setState('drawn', true)
    }

    if (this.state.newNode) {
      this.graph.addNode(this.state.newNode)
      this.state.neighbours.push(this.state.newNode)
      graphActions.setState('neighbours', this.state.neighbours)
      // We update the state of the store to be in line with the state of the child
      this.state.newNode = null
      graphActions.setState('newNode', null)
    }

    if(signal == 'redraw'){
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    } else if ( signal == 'highlight') {
      this.state.highlighted = data.highlighted
    } else if ( signal == 'erase') {
      graphActions.setState('drawn', false)
      graphActions.setState('highlighted', null)
      this.graph.eraseGraph()
    }
  },

  // When we finish linking, we select the subjet of the triple.
  linkSubject: function() {
    graphActions.chooseSubject()
  },

  //When we start the linking, we first select the Object of the triple
  linkObject: function() {
    graphActions.chooseObject()
  },

  testAdd(){
    // let destination = this.state.center
    graphActions.createAndConnectNode(this.state.user, 'test', 'description')
  },

  addNode: function(type) {
    let uri = encodeURIComponent(this.state.center.uri)
    this.context.history.pushState(null, `/graph/${uri}/add/${type}`)
  },

  componentDidMount: function() {

    this.graph = new GraphD3(this.getGraphEl(), 'full')
    graphActions.getState()
  },

  componentWillUpdate: function(){
  },

  componentDidUpdate: function() {
  },

  componentWillUnmount: function(){
    graphActions.setState('drawn', false)
    graphActions.setState('highlighted', null)
    if (this.graph) this.graph.eraseGraph()
  },

  getStyles: function() {
    let styles = {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      chart: {
        flex: 1
      },
      menu: {
        position: 'absolute',
        bottom: '16px',
        right: '16px'
      }
    }
    return styles
  },

  // We are using the buttons as placeholders, when the frontend is implemented, we will use the actuall buttons
  render: function() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <FabMenu style={styles.menu}>
          <FabMenuItem icon="radio_button_unchecked" label="Node" onClick={() => {this.addNode('node')}}/>
          <FabMenuItem icon="insert_link" label="Link" onClick={() => {this.addNode('link')}}/>
        </FabMenu>

        <div style={styles.chart} ref="graph"></div>

        {this.props.children}

        <PinnedNodes/>
      </div>
   )
  }
})
export default Radium(Graph)
