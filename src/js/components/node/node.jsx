import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import classNames from 'classnames'
import ProfileNode from 'components/node/profile.jsx'
import AddressNode from 'components/node/address.jsx'
import BankNode from 'components/node/bank.jsx'
import BankAccountNode from 'components/node/bankaccount.jsx'

import {
  AppBar,
  IconButton,
  Checkbox
} from 'material-ui'

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
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  open() {
    this.setState({open: true})
  },

  close() {
    this.setState({open: false})
  },

  toggle() {
    this.setState({open: !this.state.open})
  },

  togglePinned() {
    NodeActions.pin(this.props.params.node)
  },

  _handleClose() {
    this.context.history.goBack()
    this.close()
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
    case 'CBA':
      return <BankNode node={node}/>
    case 'BankAccount':
      return <BankAccountNode node={node}/>
    }
  },

  render() {
    let classes = classNames('jlc-node', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let styles = this.getStyles()

    let content = this.getNodeContent()

    return (
      <div className={classes}>
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
      </div>
    )
  }
})

export default Radium(Node)
