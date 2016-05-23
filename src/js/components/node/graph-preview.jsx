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
    if (this.state.loaded && !this.state.drawn){
      this.graph.render(this.state)
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
      previewActions.setState('drawn', true)
    }

    if (this.state.newNode) {
      this.graph.addNode(this.state.newNode)
      // We update the state of the store to be in line with the state of the child

      this.state.neighbours.push(this.state.newNode)
      this.state.newNode = null
      previewActions.setState('newNode', null)
    }

    if(signal == 'redraw') {
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    } else if ( signal == 'highlight') {
      this.state.highlighted = data.highlighted
    }
  },

  componentDidMount() {
    this.notSync = true
    this.listenTo(GraphStore, this.onSync)
    graphActions.eraseGraph()
    graphActions.getState()
    // Make sure we refresh our state every time we mount the component, this
    // then fires the drawing function from onStateUpdate
    this.graph = new GraphD3(this.getGraphEl(), 'preview')


    // this.graph.on is the same as this.graph.addListener()
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('select', this._handleSelect)
    this.graph.on('deselect', this._handleDeselect)
    previewActions.getState()
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
    previewActions.setState('drawn', false)
    graphActions.setState('highlighted', null)
    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },

  _handleCenterChange(node){
    previewActions.navigateToNode(node)
  },

  _handleSelect(node){
    this.props.onSelect && this.props.onSelect(node)
    previewActions.highlight(node)
  },

  _handleDeselect(){
    previewActions.highlight(null)
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
  }
})
export default Radium(Graph)
