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

  propTypes: {
    onSelect: React.PropTypes.func
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
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('change-rotation-index', this._handleChangeRotationIndex)
    this.graph.on('select', this._handleSelect)
  },

  _handleSelect(data) {
    // A onSelect function is not always passed to the component.
    this.props.onSelect && this.props.onSelect(data)
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
    previewActions.changeRotationIndex(rotationIndex)
  },

  _handleCenterChange(node) {
    previewActions.navigateToNode(node)
  }
})
export default Radium(Graph)
