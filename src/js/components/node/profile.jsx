import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import d3 from 'd3'
import nodeActions from 'actions/node'

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
    this.setState({pinned: PinnedStore.isPinned(this.props.node.uri)})
  },

  getStyles() {
    let {muiTheme} = this.context
    let {img} = this.props.node
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
        height: '176px',
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
    this.full = false
    let {name, familyName, title, description, email} = this.props.node
    if(name && familyName) name = name + ' ' + familyName

    return (
      <div style={styles.container}>
        <AppBar
          id = 'AppBar'
          style={styles.headers}
          titleStyle={styles.title}
          title={<span>{name || title || 'No name set'}</span>}
          iconElementLeft={<IconMenu
          iconButtonElement={<IconButton iconClassName="material-icons" iconStyle={styles.icon}>more_vert</IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
          >
            <MenuItem primaryText="Edit" />
            <MenuItem primaryText="Full Screen" onTouchTap={this._handleFull}/>
            <MenuItem primaryText="Delete" onTouchTap={this._handleDelete}/>
            <MenuItem primaryText="Disconect" />

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
    // Temp position.
    if (this.full){
      d3.select('#AppBar').style('height', '176px')
      d3.select('#AppBar').style('height', '176px')
      this.full = false
    }
    else {
      d3.select('#AppBar').style('height', '90vh')
      this.full = true
    }

  },

  _handleDelete() {
    this.props.onClose()
    console.log(this.props)
    nodeActions.remove(this.props)

  },
  _handleBookmarkClick() {
    PinnedActions.pin(this.props.node.uri)
  }
})

export default Radium(ProfileNode)
