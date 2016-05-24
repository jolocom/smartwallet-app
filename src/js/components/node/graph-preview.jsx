import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import previewStore from 'stores/preview-store'
import previewActions from 'actions/preview-actions'
import graphActions from 'actions/graph-actions'
import GraphStore from '../../stores/graph-store'

let Graph = React.createClass({

  mixins : [Reflux.listenTo(previewStore, 'onStateUpdate')],

  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate(data, signal) {
    this.setState(data)
    if (this.state.neighbours){
      this.graph.render(this.state)
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    }

    if (this.state.newNode) {
      this.graph.addNode(this.state.newNode)
      previewActions.setState('newNode', null, true)
    }

    if(signal == 'redraw') {
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    }
  },

  componentDidMount() {
    this.notSync = true
    this.listenTo(GraphStore, this.onSync)

    // We get the state and erase the 'parent graph'
    graphActions.getState()
    graphActions.eraseGraph()
    // Make sure we refresh our state every time we mount the component, this
    // then fires the drawing function from onStateUpdate
    this.graph = new GraphD3(this.getGraphEl())

    this.graph.on('select', this._handleSelectNode)
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('view-node', this._handleViewNode)
  },

  onSync(state, signal){
    if(!signal && this.notSync){
      previewActions.setState('center', state.center)
      previewActions.setState('loaded', true)
      previewActions.setState('navHistory', state.navHistory)
      previewActions.setState('neighbours', state.neighbours)
      previewActions.setState('user', state.user, true)
      this.notSync = false
    }
  },

  componentWillUnmount(){
    graphActions.setState('center', this.state.center)
    graphActions.setState('navHistory', this.state.navHistory)
    graphActions.setState('neighbours', this.state.neighbours, true)

    graphActions.drawGraph()
    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },

  getStyles() {
    let styles = {
      chart: {
        flex: 1
      }
    }
    return styles
  },

  // We are using the buttons as placeholders, when the frontend is implemented, we will use the actuall buttons
  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.chart} ref="graph"></div>
    )
  },

  // TODO NOT WORKING
  _handleViewNode(node) {
    previewActions.viewNode(node)
  },

  _handleCenterChange(node){
    previewActions.navigateToNode(node)
  },

  _handleSelectNode(node) {
    this.props.onSelect && this.props.onSelect(node)
  }
})
export default Radium(Graph)
