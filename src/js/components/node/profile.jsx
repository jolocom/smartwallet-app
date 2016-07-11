import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import nodeActions from 'actions/node'
import graphActions from 'stores/graph-store'

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem,
  FontIcon,
  List, ListItem, Divider
} from 'material-ui'

import PinnedActions from 'actions/pinned'
import PinnedStore from 'stores/pinned'

let ProfileNode = React.createClass({

  mixins: [
    Reflux.listenTo(PinnedStore, 'onUpdatePinned')
  ],

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },

  componentWillMount() {
    this.onUpdatePinned()
  },

  onUpdatePinned() {
    this.setState({pinned: PinnedStore.isPinned(this.props.state.activeNode.uri)})
  },

  getStyles() {
    let {muiTheme} = this.context
    let {img} = this.props.state.activeNode
    let background

    if (img) {
      background = img
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
        background: `${muiTheme.jolocom.gray1} url(${background}) center / cover`
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
      }
    }
  },

  render() {
    let styles = this.getStyles()
    let {name, familyName, title, description, email} = this.props.state.activeNode
    if(name && familyName) name = name + ' ' + familyName

    let fullscreenLabel
    if (this.state.fullscreen) {
      fullscreenLabel = 'Exit Full Screen'
    } else {
      fullscreenLabel = 'Toggle Full Screen'
    }

    return (
      <div style={styles.container}>
        <AppBar
          style={styles.headers}
          titleStyle={styles.title}
          title={<span>{name || title || 'No name set'}</span>}
          iconElementLeft={<IconMenu
          iconButtonElement={<IconButton iconClassName="material-icons" iconStyle={styles.icon}>more_vert</IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <MenuItem primaryText="Edit" />
            <MenuItem primaryText={fullscreenLabel} onTouchTap={this._handleFull} />
            <MenuItem primaryText="Copy URL" onTouchTap={this._handleCopyURL}/>
            <MenuItem primaryText="Delete" onTouchTap={this._handleDelete}/>
            <MenuItem primaryText="Disconnect" onTouchTap={this._handleDisconnect}/>

          </IconMenu>}
          iconElementRight={<IconButton iconClassName="material-icons" iconStyle={styles.icon} onClick={this._handleClose}>close</IconButton>}
        >
        </AppBar>
        <List style={styles.list}>
          {description && (
            <div>
              <ListItem
                leftIcon={<FontIcon className="material-icons">info</FontIcon>}
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
    if (this.props.state.activeNode.rank !== 'center')
      nodeActions.disconnect(this.props.state.activeNode, this.props.state.center)
  },

  _handleDelete() {
    this.props.onClose()
    let node = this.props.state.activeNode
    let center = this.props.state.center
    let navHis = this.props.state.navHistory

    if (node.rank === 'center'){
      let prev = navHis[navHis.length - 1]
      graphActions.drawAtUri(prev.uri, 1)
      setTimeout(()=>{
        nodeActions.remove(node, prev)
      }, 500)
    }
    else nodeActions.remove(node, center)
  },

  _handleBookmarkClick() {
    PinnedActions.pin(this.props.state.ActiveNode.uri)
  },

  _handleCopyURL() {

  }
})

export default Radium(ProfileNode)
