import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

// import ProfileNode from 'components/node/profile.jsx'
import NodeTypes from 'lib/node-types'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeStore from 'stores/node'
import graphActions from 'actions/graph-actions'

let Node = React.createClass({
  mixins: [
    Reflux.connect(NodeStore, 'node')
  ],

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.object
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  _handleClose() {
    this.refs.dialog.hide()
    graphActions.viewNode(null)
  },

  getStyles() {
    return {
      bar: {
        position: 'absolute',
        backgroundColor: 'transparent'
      }
    }
  },

  getNodeContent(type) {
    return NodeTypes.componentFor(type)

    return config.component
    switch (type) {
      case FOAF('PersonalProfileDocument').uri:

      case FOAF('Image').uri:

      case FOAF('Person').uri:

      default:
        return ProfileNode
    }
  },

  render() {
    let {node} = this.props
    let {center} = this.props
    let {svg} = this.props
    let {state} = this.props
    let content, Component = NodeTypes.componentFor(node.type)

    if (Component) {
      content = <Component node={node} center={center} svg={svg} state={state} onClose={this._handleClose} />
    }

    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <Content>
            {content}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(Node)
