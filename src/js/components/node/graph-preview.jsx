import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import previewStore from 'stores/preview-store'
import previewActions from 'actions/preview-actions'
import graphActions from 'actions/graph-actions'
import GraphStore from '../../stores/graph-store'
import JolocomTheme from 'styles/jolocom-theme'

let Graph = React.createClass({

  mixins : [Reflux.listenTo(previewStore, 'onStateUpdate')],

  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate(data, signal) {

    this.setState(data)
    if (this.state.neighbours){
      console.log(1)

      if (signal !== 'changeRotationIndex')
        this.graph.render(this.state)

      // this.graph.render(this.state) // @TODO why twice?
      this.graph.updateHistory(this.state.navHistory)
    }

    if (this.state.newNode) {
      console.log(2)
      previewActions.setState('newNode', null, true)
    }

    if(signal == 'redraw') {
      console.log(3)
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    }

    if (signal == 'navigateToNode') {
      this.graph.setRotationIndex(this.state.rotationIndex)
    }
  },

  componentDidMount() {
    this.notSync = true
    this.listenTo(GraphStore, this.onSync)

    // We get the state and erase the 'parent graph'
    graphActions.getState('preview')
    graphActions.eraseGraph()

    // Make sure we refresh our state every time we mount the component, this
    // then fires the drawing function from onStateUpdate
    this.graph = new GraphD3(this.getGraphEl(), 'preview')

    this.graph.on('select', this._handleSelectNode)
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('view-node', this._handleViewNode)
    this.graph.on('change-rotation-index', this._handleChangeRotationIndex)
  },

  onSync(state, signal){
    if(signal=='preview' && this.notSync){
      previewActions.setState('center', state.center)
      previewActions.setState('loaded', true)
      previewActions.setState('navHistory', state.navHistory)
      previewActions.setState('neighbours', state.neighbours)
      previewActions.setState('user', state.user, true)
      previewActions.changeRotationIndex(state.rotationIndex, true)
      this.graph.setRotationIndex(state.rotationIndex)
      this.notSync = false
    }
  },

  componentWillUnmount(){
    graphActions.setState('center', this.state.center)
    graphActions.setState('navHistory', this.state.navHistory)
    graphActions.setState('neighbours', this.state.neighbours, true)
    graphActions.changeRotationIndex(this.state.rotationIndex, true)
    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },

  getStyles() {
    let styles = {
      chart: {
        flex: 1,
        background: JolocomTheme.jolocom.gray2
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


  _handleChangeRotationIndex(rotationIndex){
    previewActions.changeRotationIndex(rotationIndex,true)
  },

  // TODO NOT WORKING
  _handleViewNode(node) {
    previewActions.viewNode(node)
  },

  _handleCenterChange(node){
    previewActions.navigateToNode(node)
  },

  _handleSelectNode(data) {
    this.props.onSelect && this.props.onSelect(data)
  }
})
export default Radium(Graph)
