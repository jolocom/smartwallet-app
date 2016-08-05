import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import graphActions from 'stores/graph-store'
import nodeActions from 'actions/node'
import Utils from 'lib/util'
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem,
  FontIcon,
  Tabs, Tab,
  List, ListItem, Divider
} from 'material-ui'

import {Content} from '../layout'

import PinnedActions from 'actions/pinned'
import PinnedStore from 'stores/pinned'

let ProfileNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned')
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

  getStyles() {
    let {muiTheme} = this.context
    let {gray1} = muiTheme.jolocom
    let {img} = this.getNode()
    let background

    if (img) {
      background = Utils.uriToProxied(img)
    }

    return {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      headers: {
        color: '#ffffff',
        height: this.state.fullscreen ? '90vh' : '176px',
        background: `${gray1} url(${background}) center / cover`,
        boxShadow: 'none'
      },
      title: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: '0 24px',
        color: '#ffffff'
      },
      white:{
        color: '#fff'
      },
      action: {
        position: 'absolute',
        bottom: '-20px',
        right: '20px',
        backgroundColor: this.state.pinned ? muiTheme.palette.accent1Color :
          muiTheme.jolocom.gray4
      },
      icon: {
        color: '#ffffff'
      },
      content: {

      },
      tabs: {
        backgroundColor: '#ffffff'
      }
    }
  },

  getNode() {
    if (this.props.state) {
      return this.props.state.activeNode // TODO temp fix
    } else {
      return this.props.node
    }
  },

  render() {
    let styles = this.getStyles()
    let {
      name,
      familyName,
      title,
      description,
      email
    } = this.getNode()

    if (name && familyName) {
      name = `${name} ${familyName}`
    }

    let fullscreenLabel
    if (this.state.fullscreen) {
      fullscreenLabel = 'Exit Full Screen'
    } else {
      fullscreenLabel = 'Toggle Full Screen'
    }

    return (
      <div style={styles.container}>
        <AppBar
          id = 'AppBar'
          style={styles.headers}
          titleStyle={styles.title}
          title={<span>{name || title || 'No name set'}</span>}
          iconElementRight={
              <IconMenu iconButtonElement={
              <IconButton
                iconClassName="material-icons"
                iconStyle={styles.icon}>
                  more_vert
              </IconButton>
            }
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem
              primaryText="Edit" />
            <MenuItem
              primaryText={fullscreenLabel}
              onTouchTap={this._handleFull} />
              
            <CopyToClipboard
              text={this.props.state.center.uri} 
              onCopy={this._handlePostCopyURL}>
                <MenuItem
                  primaryText="Copy URL" />
            </CopyToClipboard>
            
            <MenuItem
              primaryText="Delete"
              onTouchTap={this._handleDelete}/>
            <MenuItem
              primaryText="Disconnect"
              onTouchTap={this._handleDisconnect}/>

          </IconMenu>}
          iconElementLeft={
            <IconButton
              iconClassName="material-icons"
              iconStyle={styles.icon}
              onClick={this._handleClose}>
                arrow_back
            </IconButton>
          }
        >
        </AppBar>
        <Content style={styles.content}>
          <Tabs
            onChange={() => {}}
            value={null}
            inkBarStyle={{display: 'none'}}
            tabItemContainerStyle={styles.tabs}>
            <Tab
              icon={<FontIcon className="material-icons">chat</FontIcon>}
              label="MESSAGE"
              onActive={() => this._handleStartChat()}
            />
            <Tab
              icon={
                <FontIcon className="material-icons">bookmark_border</FontIcon>
              }
              label="BOOKMARK"
            />
            <Tab
              icon={<FontIcon className="material-icons">link</FontIcon>}
              label="CONNECT"
            />
          </Tabs>
          <List style={styles.list}>
            {description && (
              <div>
                <ListItem
                  leftIcon={
                    <FontIcon className="material-icons">info</FontIcon>
                  }
                  primaryText={description}
                />
                <Divider inset={true} />
              </div>
            )}
            {email && (
              <ListItem
                leftIcon={<FontIcon className="material-icons">email</FontIcon>}
                primaryText={email}
                secondaryText="Personal"
              />
            )}
          </List>
        </Content>
      </div>
    )
  },

  _handleClose() {
    this.props.onClose()
  },

  _handleFull() {
    this.setState({fullscreen: !this.state.fullscreen})
  },

 _handleDisconnect(){
    this.props.onClose() 
    if (this.props.state.activeNode.rank != 'center')
    	nodeActions.disconnectNode(this.props.state.activeNode, this.props.state.center)
	},

 _handleDelete() {
    this.props.onClose()
    let node = this.props.state.activeNode
    let center = this.props.state.center
    let navHis = this.props.state.navHistory

    if (node.rank == 'center'){
     let prev = navHis[navHis.length - 1]
     graphActions.drawAtUri(prev.uri, 1).then(()=>{
       nodeActions.remove(node, prev)
     })
    }
    else nodeActions.remove(node, center)
  },

  _handleBookmarkClick() {
    const {uri} = this.getNode()
    if (uri) {
      PinnedActions.pin(uri)
    }
  },

  _handlePostCopyURL() {
    alert('The URL was copied to the clipboard.')
  },

  _handleStartChat() {
    const {history} = this.context
    history.pushState(null, `/conversations/${this.props.node.username}`)
  }
})

export default Radium(ProfileNode)
