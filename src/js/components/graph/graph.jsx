// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances.
// It is also stateless,
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import GraphStore from 'stores/graph-store'
import graphActions from 'actions/graph-actions'
import IndicatorOverlay from 'components/graph/indicator-overlay.jsx'
import Loading from 'components/common/loading.jsx'
import Radium from 'radium'
import AddNodeIcon from 'components/icons/addNode-icon.jsx'
import LinkIcon from 'material-ui/svg-icons/content/link'

let Graph = React.createClass({
  mixins: [Reflux.listenTo(GraphStore, 'onStateUpdate', 'setInitialState')],

  propTypes: {
    children: React.PropTypes.node,
    params: React.PropTypes.object,
    routes: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object,
    searchActive: React.PropTypes.bool,
    account: React.PropTypes.object
  },

  childContextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getChildContext() {
    return {
      node: this.state.center,
      user: this.state.webId
    }
  },

  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  setInitialState(initialState) {
    this.state = initialState
  },

  onStateUpdate(data) {
    this.setState(data)
  },

  componentDidMount() {
    console.log('MOUNTED')
    console.log(this.state)
    this.graph = new GraphD3(this.getGraphEl(), 'main')

    // Adding the listeners.
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('view-node', this._handleViewNode)
    this.graph.on('change-rotation-index', this._handleChangeRotationIndex)
    this.graph.on('scrolling-drawn', this._handleScrollingDrawn)

    if (!this.state.initialized) {
      graphActions.getInitialGraphState()
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.initialized) {
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    }
  },

  componentWillUpdate() {
  },

  _handleChangeRotationIndex(rotationIndex) {
    graphActions.changeRotationIndex(rotationIndex)
  },

  _handleCenterChange(node) {
    graphActions.navigateToNode(node, this.state.center)
  },

  // max visible nodes reached, show indicator overlay
  _handleScrollingDrawn() {
    // refers to show() method of IndicatorOverlay component
    this.refs.scrollIndicator.show()
  },

  getStyles: function() {
    let styles = {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      chart: {
        flex: 1,
        overflow: 'hidden'
      },
      menu: {
        position: 'absolute',
        bottom: '16px',
        right: '16px'
      },
      loading: {
        backgroundColor: 'transparent',
        position: 'absolute'
      }
    }
    return styles
  },

  render: function() {
    let styles = this.getStyles()

    let fab

    if (!this.context.searchActive) {
      fab = (
        <FabMenu style={styles.menu} icon='add' closeIcon='close'>
          <FabMenuItem
            icon={<AddNodeIcon />}
            label='Node' onTouchTap={this._handleAddNodeTouchTap} />
          <FabMenuItem
            icon={<LinkIcon />}
            label='Link' onClick={this._handleLinkNodeTouchTap} />
        </FabMenu>
      )
    }

    let children = React.Children.map(this.props.children, (el) => {
      return React.cloneElement(el, {
        node: this.state.activeNode,
        center: this.state.center,
        navHistory: this.state.navHistory,
        state: this.state
      })
    })

    let loading
    if (!this.state.initialized) {
      loading = <Loading style={styles.loading} />
    }

    return (
      <div style={styles.container}>
        <IndicatorOverlay ref='scrollIndicator' />
        <div style={styles.chart} ref='graph' />
        {loading}
        {fab}
        {children}
      </div>
    )
  },

  _handleViewNode(node) {
    let uri = encodeURIComponent(node.uri)
    this.context.router.push(`/graph/${uri}/view`)
  },

  addNode(type) {
    let uri = encodeURIComponent(this.state.center.uri)
    this.context.router.push(`/graph/${uri}/add/${type}`)
  },

  _handleAddNodeTouchTap() {
    this.addNode('node')
  },

  _handleLinkNodeTouchTap() {
    this.addNode('link')
  }
})

export default Radium(Graph)
