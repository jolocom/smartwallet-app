import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import ProfileNode from 'components/node/profile.jsx'
import AddressNode from 'components/node/address.jsx'

import {
  AppBar,
  IconButton,
  Checkbox
} from 'material-ui'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeActions from 'actions/node'

import NodeStore from 'stores/node'

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

  togglePinned() {
    NodeActions.pin(this.props.params.node)
  },

  _handleClose() {
    this.context.history.goBack()
    this.refs.dialog.hide()
  },

  getStyles() {
    return {
      bar: {
        position: 'absolute',
        backgroundColor: 'transparent'
      }
    }
  },

  getNodeContent() {
    let {node} = this.context

    if (!node) return null

    if (node.nodeType === 'contact') {
      return <ProfileNode node={node}/>
    }
    switch(node.description) {
      case 'Address':
        return <AddressNode node={node}/>
    }
  },

  render() {
    let styles = this.getStyles()

    let content = this.getNodeContent()

    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <AppBar
            iconElementLeft={<IconButton onTouchTap={this._handleClose} iconClassName="material-icons">close</IconButton>}
            iconElementRight={<Checkbox name="inbox" onChange={this.togglePinned}></Checkbox>}
            style={styles.bar}
            zDepth={0}
          />
          <Content>
            {content}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(Node)
