import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import CopyToClipboard from 'react-copy-to-clipboard'

// import ProfileNode from 'components/node/profile.jsx'
// import NodeTypes from 'lib/node-types/index'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeStore from 'stores/node'
import graphActions from 'actions/graph-actions'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionBookmark from 'material-ui/svg-icons/action/bookmark'
import CommunicationChat from 'material-ui/svg-icons/communication/chat'
import ContentLink from 'material-ui/svg-icons/content/link'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem
} from 'material-ui'

let GenericFullScreen = React.createClass({
  mixins: [
    Reflux.connect(NodeStore, 'node')
  ],

  propTypes: {
    state: React.PropTypes.object,
    node: React.PropTypes.object,
    onClose: React.PropTypes.func,
    backgroundImg: React.PropTypes.any,
    menuItems: React.PropTypes.arrayOf(React.PropTypes.string),
    copyToClipboardText: React.PropTypes.any,
    title: React.PropTypes.string,
    fabItems: React.PropTypes.arrayOf(React.PropTypes.string),
    children: React.PropTypes.any
  },

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  componentWillMount() {
    this.props.menuItems.unshift('fullscreen')
    // console.log('cwm',this.props.menuItems)
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  getStyles() {
    let {muiTheme} = this.context
    let {gray1} = muiTheme.jolocom

    return {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      headers: {
        color: '#ffffff',
        height: this.state.fullscreen ? '90vh' : '176px',
        background: `${gray1} ${this.props.backgroundImg} center / cover`,
        boxShadow: 'none'
      },
      title: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: '0 24px',
        color: '#ffffff'
      },
      floatingButtons: {
        position: 'absolute',
        right: '10px',
        marginTop: '-28px',
        zIndex: 1500
      },
      fabBtn: {
        margin: '0px 10px'
      },
      fabIcon: {
        fill: '#9a3460'
      }
    }
  },

  _handleClose() {
    this.refs.dialog.hide()
    graphActions.viewNode(null)
  },

  _handleDisconnect() {
    this.props.onClose()
    if (this.props.state.activeNode.rank !== 'center') {
      nodeActions.disconnectNode(
        this.props.state.activeNode, this.props.state.center
      )
    }
  },

  _handleDelete() {
    this.props.onClose()
    let node = this.props.state.activeNode
    // let center = this.props.state.center
    let navHis = this.props.state.navHistory

    if (graphActions.state.webId === node.uri) {
      alert('You cannot remove your own node.') // @TODO toast/snackbar
    } else if (node.rank === 'center') {
      let prev = navHis[navHis.length - 1]
      graphActions.drawAtUri(prev.uri, 1).then(() => {
        nodeActions.remove(node, prev)
      })
    }
  },

  getNode() {
    if (this.props.state) {
      return this.props.state.activeNode // TODO temp fix
    } else {
      return this.props.node
    }
  },

  chatFn () {
    alert('woohoo chat!')
  },

  bookmarkFn() {
    alert('woohoo bookmark!')
  },

  connectFn() {
    alert('woohoo connect!')
  },

  _handleFull() {
    this.setState({fullscreen: !this.state.fullscreen})
  },

  // menuItem (optional?)
  getAction(iconString) {
    switch (iconString) {
      case 'chat':
        return {icon: (<CommunicationChat />),
          handler: this.chatFn, title: 'Chat'}
      case 'bookmark':
        return {icon: (<ActionBookmark />),
          handler: this.bookmarkFn, title: 'Bookmark'}
      case 'connect':
        return {icon: (<ContentLink />),
          handler: this.connectFn, title: 'Connect'}
      case 'delete':
        return {handler: this._handleDelete, title: 'Delete'}
      case 'disconnect':
        return {handler: this._handleDisconnect, title: 'Disconnect'}
      case 'edit':
        return {icon: (<EditorModeEdit />), title: 'Edit'}
      case 'fullscreen':
        return {handler: this._handleFull,
          title: this.state.fullscreen ? 'Exit full screen' : 'Full screen'}
      case 'copyUrl': // @TODO not optimal
        return {
          menuItem: (
            <CopyToClipboard
              text={this.props.copyToClipboardText}
              onCopy={this._handlePostCopyURL}>
              <MenuItem primaryText="Copy URL" />
            </CopyToClipboard>)
        }
      /* case 'copy':
        return (<ContentCopy />)
      case 'save':
        return (<ContentSave />)
      case 'read':
        return (<CommunicationImportContacts />)
      case 'edit':
        return (<EditorModeEdit />)*/
      default:
        console.error('No action info found for', iconString)
        return {}
        // return (<AlertError />)
    }
  },

  _handleBookmarkClick() {
    const {uri} = this.getNode()
    if (uri) {
      PinnedActions.pin(uri)
    }
  },

  _handleStartChat() {
    const {history} = this.context
    history.pushState(null, `/conversations/${this.props.node.username}`)
  },

  render() {
    let styles = this.getStyles()

    /* let fullscreenLabel
    if (this.state.fullscreen) {
      fullscreenLabel = 'Exit Full Screen'
    } else {
      fullscreenLabel = 'Toggle Full Screen'
    }*/

    // @TODO bind handlers to preset actions here
    // in: {name: 'disconnect'}
    // out: {name: 'disconnect',
    //    component: <Disconnect>, handler: disconnecthandler} (overwritable)
    // map ((e) return object.assign({}, default, e))

    // @TODO pass fab 0-3 and set which one is primary (flag?),
    //    or reverse? ['primary','other button', 'other button']
    // @TODO foreach fab print dom

    // @TODO externalize fab handlers + component etc

    // Always add the fullscreen menu item

    // console.log('render',this.props.menuItems)

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <Content>
            <div style={styles.container}>
              <AppBar
                style={styles.headers}
                titleStyle={styles.title}
                title={<span>{this.props.title || 'No title'}</span>}
                iconElementRight={
                  <IconMenu
                    iconButtonElement={
                      <IconButton
                        iconClassName="material-icons"
                        iconStyle={styles.icon}>
                          more_vert
                      </IconButton>
                    }
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}>

                    {this.props.menuItems.map(function(menuItem) {
                      let menuItemInfo = this.getAction(menuItem)
                      if ('menuItem' in menuItemInfo) {
                        return menuItemInfo.menuItem
                      }
                      return (
                        <MenuItem
                          primaryText={menuItemInfo.title}
                          onTouchTap={menuItemInfo.handler} />
                      )
                    }.bind(this))}
                  </IconMenu>
                }
                iconElementLeft={
                  <IconButton
                    iconClassName="material-icons"
                    iconStyle={styles.icon}
                    onClick={this._handleClose}>
                      arrow_back
                  </IconButton>
                  }
              />
              <div style={styles.floatingButtons}>
                <FloatingActionButton
                  backgroundColor={'#fff'}
                  style={styles.fabBtn}
                  iconStyle={styles.fabIcon}
                  onTouchTap={this.getAction(this.props.fabItems[0]).handler}>
                  {this.getAction(this.props.fabItems[0]).icon}
                </FloatingActionButton>
                <FloatingActionButton
                  backgroundColor={'#fff'}
                  style={styles.fabBtn}
                  iconStyle={styles.fabIcon}
                  onTouchTap={this.getAction(this.props.fabItems[1]).handler}>
                  {this.getAction(this.props.fabItems[1]).icon}
                </FloatingActionButton>
                <FloatingActionButton
                  style={styles.fabBtn} secondary
                  onTouchTap={this.getAction(this.props.fabItems[2]).handler}>
                  {this.getAction(this.props.fabItems[2]).icon}
                </FloatingActionButton>
              </div>
              {this.props.children}
            </div>
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(GenericFullScreen)

/*
<MenuItem
                      primaryText="Edit" />
                    <MenuItem
                      primaryText={fullscreenLabel}
                      onTouchTap={this._handleFull} />
                    <CopyToClipboard
                      text={this.props.copyToClipboardText}
                      onCopy={this._handlePostCopyURL}>
                      <MenuItem primaryText="Copy URL" />
                    </CopyToClipboard>
                    <MenuItem
                      primaryText="Delete"
                      onTouchTap={this._handleDelete} />
                    <MenuItem
                      primaryText="Disconnect"
                      onTouchTap={this._handleDisconnect} />
                      */
