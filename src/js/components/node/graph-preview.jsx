import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import previewStore from 'stores/preview-store'
import previewActions from 'actions/preview-actions'
import graphActions from 'actions/graph-actions'
import JolocomTheme from 'styles/jolocom-theme'

let Graph = React.createClass({
  mixins: [Reflux.listenTo(previewStore, 'onStateUpdate', 'initialState')],

  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  initialState(state) {
    this.state = state
  },

  onStateUpdate(data) {
    this.setState(data)
  },

  componentDidUpdate() {
    if (this.state.initialized) {
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    }
  },

  componentDidMount() {
    this.graph = new GraphD3(this.getGraphEl(), 'preview')
    // Adding the listeners
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('select', this._handleSelectNode)
    this.graph.on('view-node', this._handleViewNode)
    this.graph.on('change-rotation-index', this._handleChangeRotationIndex)
  },

  componentWillUnmount() {
    graphActions.syncStateWithPreview(this.state)
  },

  getStyles() {
    let styles = {
      chart: {
        flex: 1,
        background: JolocomTheme.jolocom.gray3
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.chart} ref='graph' />
    )
  },

  _handleChangeRotationIndex(rotationIndex) {
    previewActions.changeRotationIndex(rotationIndex, true)
  },

  // TODO NOT WORKING
  _handleViewNode(node) {
    previewActions.viewNode(node)
  },

  _handleCenterChange(node) {
    previewActions.navigateToNode(node)
  },

  _handleSelectNode(data) {
    this.props.onSelect && this.props.onSelect(data)
  }
})
export default Radium(Graph)
