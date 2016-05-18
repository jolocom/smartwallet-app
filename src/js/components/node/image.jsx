import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {
  AppBar,
  IconButton,
  FloatingActionButton,
  FontIcon,
  List, ListItem, Divider
} from 'material-ui'

import PinnedActions from 'actions/pinned'
import PinnedStore from 'stores/pinned'

let ImageNode = React.createClass({

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
      header: {
        color: '#fff',
        height: '100%',
        background: `${muiTheme.jolocom.gray1} url(${background}) center / cover`
      },
      title: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: '0 24px'
      },
      action: {
        position: 'absolute',
        bottom: '-20px',
        right: '20px',
        backgroundColor: this.state.pinned ? muiTheme.palette.accent1Color :
          muiTheme.jolocom.gray4
      }
    }
  },

  render() {
    let styles = this.getStyles()
    console.log('this is an image node')
    let {name, title, description, email} = this.props.node

    return (
      <div style={styles.container}>
        <AppBar
          style={styles.header}
          titleStyle={styles.title}
          title={<span>{name || title || 'No name set'}</span>}
          iconElementLeft={<IconButton iconClassName="material-icons" onClick={this._handleClose}>close</IconButton>}
          iconElementRight={<IconButton iconClassName="material-icons">more_vert</IconButton>}
        >
          <FloatingActionButton mini={true} backgroundColor={styles.action.backgroundColor} style={styles.action} onClick={this._handleBookmarkClick}>
            <FontIcon className="material-icons">bookmark</FontIcon>
          </FloatingActionButton>
        </AppBar>



      </div>
    )
  },

  _handleClose() {
    this.props.onClose()
  },

  _handleBookmarkClick() {
    PinnedActions.pin(this.props.node.uri)
  }
})

export default Radium(ImageNode)
