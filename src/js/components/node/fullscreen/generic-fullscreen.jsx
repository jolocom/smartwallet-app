import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import Utils from 'lib/util'
import CopyToClipboard from 'react-copy-to-clipboard'

// import ProfileNode from 'components/node/profile.jsx'
// import NodeTypes from 'lib/node-types/index'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeStore from 'stores/node'
import graphActions from 'actions/graph-actions'

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem,
  FontIcon,
  List, ListItem, Divider
} from 'material-ui'

let GenericFullScreen = React.createClass({
  mixins: [
    Reflux.connect(NodeStore, 'node')
  ],

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.object,
    muiTheme: React.PropTypes.object
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
      }
    }
  },

  _handleClose() {
    this.refs.dialog.hide()
    graphActions.viewNode(null)
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

    /*let {
      name,
      familyName,
      title,
      description,
      email
    } = this.getNode()*/
    
    let name = 'default name', familyName = 'default familyname', description = 'default description', email = 'default email';

    let fullscreenLabel
    if (this.state.fullscreen) {
      fullscreenLabel = 'Exit Full Screen'
    } else {
      fullscreenLabel = 'Toggle Full Screen'
    }

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
                {this.props.children}
            </div>
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(GenericFullScreen)
