import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import graphActions from 'stores/graph-store'
import nodeActions from 'actions/node'
import Utils from 'lib/util'
import CopyToClipboard from 'react-copy-to-clipboard'

import NodeStore from 'stores/node'
import GenericFullScreen from '../generic-fullscreen'

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem,
  FontIcon,
  List, ListItem, Divider
} from 'material-ui'

import {Content} from 'components/layout'

import PinnedActions from 'actions/pinned'
import PinnedStore from 'stores/pinned'

let ProfileNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned'),
    Reflux.connect(NodeStore, 'node')
  ],

  propTypes: {
    state: React.PropTypes.object, /* @TODO fix this */
    node: React.PropTypes.object,
    onClose: React.PropTypes.func
  },

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  componentWillMount() {
    this.onUpdatePinned()
  },

  onUpdatePinned() {
    const node = this.getNode()

    if (node) {
      this.setState({
        pinned: PinnedStore.isPinned(node.uri)
      })
    }
  },

  // TODO: this needs to pull this state/node-type from outside
  getInitialState() {
    return {
      nodeType: 'person'
    }
  },

  getStyles() {
    let {muiTheme} = this.context


    return {

      white: {
        color: '#fff'
      },
      action: {
        position: 'absolute',
        bottom: '-20px',
        right: '20px',
        backgroundColor: this.state.pinned && muiTheme.palette.accent1Color ||
          muiTheme.jolocom.gray4
      },
      icon: {
        color: '#ffffff'
      },
      tabs: {
        backgroundColor: '#ffffff'
      }
    }
  },

  // TODO: rename functions, arrange
  copyFn() {
    alert('woohoo copy!')
  },

  deleteFn() {
    alert('woohoo delete!')
  },

  saveFn() {
    alert('woohoo save!')
  },

  readFn() {
    alert('woohoo read!')
  },

  editFn() {
    alert('woohoo edit!')
  },

  // TODO: discuss proper structure of this data, and whether local or external
  /*getInteractions() {
    return {
      person: {
        actions: {
          p1: 'chat',
          p2: 'bookmark',
          p3: 'connect',
          other: ['hug', 'slap', 'help']
        },
        functions: [
        ]
      },
      image: {
        actions: {
          p1: 'copy',
          p2: 'delete',
          p3: 'save',
          other: ['report', 'bookmark', 'edit']
        },
        functions: [
          this.copyFn,
          this.deleteFn,
          this.saveFn
        ]
      },
      text: {
        actions: {
          p1: 'read',
          p2: 'copy',
          p3: 'edit',
          other: ['translate']
        },
        functions: [
          this.readFn,
          this.copyFn,
          this.editFn
        ]
      }
    }
  },

  
  // TODO: helper functions as _fn? naming conventions
  handleInteractionIcon(num) {
    let ix = this.getInteractions()
    let ixIcon = ix[this.state.nodeType].actions[num]
    return (this.handleStringToInteractionIcon(ixIcon))
  },*/

  getNode() {
    if (this.props.state) {
      return this.props.state.activeNode // TODO temp fix
    } else {
      return this.props.node
    }
  },

  render() {
    let styles = this.getStyles()
    // let ix = this.getInteractions()
    let {
      name,
      familyName,
      title,
      description,
      email,
      uri,
      img
    } = this.getNode()
    
    if (name && familyName) {
      name = `${name} ${familyName}`
    }
    
    let backgroundImg = img ? `url(${Utils.uriToProxied(img)})` : 'none'
    
    
  
    let fabItems = ['chat','bookmark','connect']
    let menuItems = ['hug','slap','help']

    return (
      <GenericFullScreen
        title={name}
        copyToClipboardText={uri}
        backgroundImg={backgroundImg}
        fabItems={fabItems}
        menuItems={menuItems}>
          <List style={styles.list}>
            {description && (
              <div>
                <ListItem
                  leftIcon={
                    <FontIcon className="material-icons">info</FontIcon>
                  }
                  primaryText={description}
                />
                <Divider inset />
              </div>
            )}
            {email && (
              <ListItem
                leftIcon={
                  <FontIcon className="material-icons">email</FontIcon>}
                primaryText={email}
                secondaryText="Personal"
              />
            )}
          </List>
      </GenericFullScreen>
    )
  },

  _handleClose() {
    this.props.onClose()
  },

  _handleFull() {
    this.setState({fullscreen: !this.state.fullscreen})
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

  _handleBookmarkClick() {
    const {uri} = this.getNode()
    if (uri) {
      PinnedActions.pin(uri)
    }
  },

  _handleStartChat() {
    const {history} = this.context
    history.pushState(null, `/conversations/${this.props.node.username}`)
  }
})

export default Radium(ProfileNode)

// <AppBar
//   style={styles.headers}
//   titleStyle={styles.title}
//   title={<span>{name || title || 'No name set'}</span>}
//   iconElementRight={
//     <IconMenu
//       iconButtonElement={
//         <IconButton
//           iconClassName="material-icons"
//           iconStyle={styles.icon}>
//             more_vert
//         </IconButton>
//       }
//       anchorOrigin={{horizontal: 'left', vertical: 'top'}}
//       targetOrigin={{horizontal: 'left', vertical: 'top'}}>
//       <MenuItem
//         primaryText="Edit" />
//       <MenuItem
//         primaryText={fullscreenLabel}
//         onTouchTap={this._handleFull} />
//       <CopyToClipboard
//         text={this.props.state.center.uri}
//         onCopy={this._handlePostCopyURL}>
//         <MenuItem primaryText="Copy URL" />
//       </CopyToClipboard>
//       <MenuItem
//         primaryText="Delete"
//         onTouchTap={this._handleDelete} />
//       <MenuItem
//         primaryText="Disconnect"
//         onTouchTap={this._handleDisconnect} />
//     </IconMenu>
//   }
//   iconElementLeft={
//     <IconButton
//       iconClassName="material-icons"
//       iconStyle={styles.icon}
//       onClick={this._handleClose}>
//         arrow_back
//     </IconButton>
//     }
//   />
