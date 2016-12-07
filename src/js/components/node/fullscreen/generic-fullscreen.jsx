import React from 'react'
import Reflux from 'reflux'
import Dialog from 'components/common/dialog'
import CopyToClipboard from 'react-copy-to-clipboard'
import nodeActions from 'actions/node'
import {Layout, Content} from 'components/layout'
import ProfileActions from 'actions/profile'
import ConfirmActions from 'actions/confirm'
import Radium from 'radium'
import NodeStore from 'stores/node'
import graphActions from 'actions/graph-actions'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import CommunicationChat from 'material-ui/svg-icons/communication/chat'
import ContentLink from 'material-ui/svg-icons/content/link'
import ContentUnlink from 'material-ui/svg-icons/communication/call-split'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ShareIcon from 'material-ui/svg-icons/content/reply'
import DocIcon from 'components/icons/doc-icon.jsx'
import PersonIcon from 'components/icons/person-icon.jsx'
import ConfidIcon from 'components/icons/confid-icon.jsx'

import SnackbarActions from 'actions/snackbar'

import Debug from 'lib/debug'
let debug = Debug('components:generic-fullscreen')

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem,
  Divider,
  Subheader
} from 'material-ui'

let GenericFullScreen = React.createClass({
  mixins: [
    Reflux.connect(NodeStore, 'node')
  ],

  propTypes: {
    node: React.PropTypes.object,
    center: React.PropTypes.object,
    navHistory: React.PropTypes.object,
    onClose: React.PropTypes.func,
    backgroundImg: React.PropTypes.any,
    headerColor: React.PropTypes.any,
    menuItems: React.PropTypes.arrayOf(React.PropTypes.string),
    copyToClipboardText: React.PropTypes.any,
    title: React.PropTypes.string,
    fabItems: React.PropTypes.arrayOf(React.PropTypes.string),
    children: React.PropTypes.any,
    state: React.PropTypes.any
  },

  contextTypes: {
    router: React.PropTypes.any,
    node: React.PropTypes.object,
    muiTheme: React.PropTypes.object,
    account: React.PropTypes.object
  },

  componentWillMount() {
    // this.props.menuItems.unshift('fullscreen')
  },

  componentDidMount() {
    // Luminance
    let backgroundImgMatches
    if (this.props.backgroundImg &&
        this.props.backgroundImg !== 'none' &&
        (backgroundImgMatches = /^url\(['"]?(.+)['"]?\)$/
                               .exec(this.props.backgroundImg))
       ) {
      let backgroundImgUrl = backgroundImgMatches[1]
      let bgLuminanceP = this.getLuminanceForImageUrl(backgroundImgUrl)
      bgLuminanceP.then((lum) => {
        debug('Background image has luminance of', lum)
        this.setState({luminance: lum})
      }).catch((e) => {
        // console.error('Couldn\'t compute luminance', e)
      })
    }

    this.refs.dialog.show()
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  getStyles() {
    return {
      container: {
        // flex: 1,
        // display: 'flex',
        // flexDirection: 'column',
        overflowY: 'scroll'
      },
      headers: {
        color: '#ffffff',
        height: this.state.fullscreen ? '90vh' : '40vh',
        background: `${this.props.headerColor}
          ${this.props.backgroundImg} center / cover`,
        boxShadow: 'inset 0px 0px 129px -12px rgba(0,0,0,0.5)'
      },
      title: {
        padding: '0 24px',
        color: '#4b132b',
        fontWeight: '100'
      },
      titleDivider: {
        marginTop: '10px'
      },
      floatingButtons: {
        position: 'relative',
        right: '10px',
        marginTop: '-28px',
        zIndex: 1500,
        textAlign: 'right'
      },
      fabBtn: {
        margin: '0px 10px'
      },
      fabIcon: {
        fill: '#9a3460'
      },
      headerIcon: {
        position: 'relative',
        zIndex: 1500,
        width: '100px',
        height: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        top: '15vh'
      },
      subheader: {
        marginTop: '40px',
        paddingLeft: '24px',
        lineHeight: '20px'
      }
    }
  },

  _handleClose() {
    graphActions.setState('activeNode', null, false)
    this.context.router.push('/graph/' +
      encodeURIComponent(this.props.state.center.uri))
  },

  _handleDisconnect() {
    if (this.props.node.rank === 'center') {
      this._handleClose()
    } else {
      ConfirmActions.confirm(
        'Are you sure you want to disconnect this node ?',
        'Disconnect',
        () => {
          this._handleClose()

          nodeActions.disconnectNode(
            this.props.node, this.props.state.center
          )

          let onDisconnectUndo = () => {
            nodeActions.link(this.props.state.center.uri,
                             'knows',
                             this.props.node.uri,
                             false)
            let unsub = nodeActions.link.completed.listen(() => {
              unsub()
              graphActions.drawAtUri(this.props.state.center.uri, 0)
            })
          }

          // @TODO Wait until it's actually disconnected
          SnackbarActions.showMessageUndo(
              'The node has been successfully disconnected',
              onDisconnectUndo)
        }
      )
    }
  },

  _handleConnect() {
    nodeActions.link(
      this.context.account.webId,
      'generic',
      this.props.node.uri
    )
    SnackbarActions.showMessage('You are now connected to the node.')
    this._handleClose()
  },

  _handleDelete() {
    let node = this.props.state.activeNode
    let center = this.props.state.center
    let navHis = this.props.state.navHistory

    if (node.rank === 'center') {
      let prev = navHis[navHis.length - 1]
      debug('Deleting center node; navigating to previous node', prev.uri)
      // graphActions.drawAtUri(prev.uri, 1)
      this.context.router.push(`/graph/${encodeURIComponent(prev.uri)}`)
      nodeActions.remove(node, prev) // will refresh the graph
    } else {
      this.context.router.push(`/graph/${encodeURIComponent(center.uri)}`)
      nodeActions.remove(node, center)
    }

    graphActions.setState('activeNode', null, true)
  },

  getNode() {
    return this.props.node
  },

  _handleFull() {
    this.setState({fullscreen: !this.state.fullscreen})
  },

  // menuItem (optional?)
  getAction(iconString) {
    switch (iconString) {
      case 'chat':
        return {
          title: 'Chat',
          icon: <CommunicationChat />,
          handler: this._handleStartChat}
      case 'delete':
        return {title: 'Delete', handler: this._handleDelete}
      case 'connect':
        return {
          title:
          'Connect',
          icon: <ContentLink />,
          handler: this._handleConnect
        }
      case 'disconnect':
        return {
          title:
          'Disconnect',
          icon: <ContentUnlink />,
          handler: this._handleDisconnect
        }
      case 'edit':
        return {
          title: 'Edit',
          handler: this._handleEdit,
          icon: <EditorModeEdit />
        }
      case 'fullscreen':
        return {
          handler: this._handleFull,
          title: this.state.fullscreen ? 'Exit full screen' : 'Full screen'
        }
      case 'copyUrl': // @TODO not optimal
        return {
          icon: <ShareIcon />,
          menuItem: (
            <CopyToClipboard
              text={this.props.copyToClipboardText}
              onCopy={this._handlePostCopyURL}
            >
              <MenuItem primaryText="Copy URL" />
            </CopyToClipboard>),
          fabItem: (
            <CopyToClipboard
              text={this.props.copyToClipboardText}
              onCopy={this._handlePostCopyURL}
            >
              <FloatingActionButton
                style={this.getStyles().fabBtn}
                secondary
              >
                <ShareIcon />
              </FloatingActionButton>
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
        // console.error('No action info found for', iconString)
        return {}
        // return (<AlertError />)
    }
  },

  // _handleBookmarkClick() {
  //   const {uri} = this.getNode()
  //   if (uri) {
  //     // @TODO fix bookmarking
  //     // PinnedActions.pin(uri)
  //   }
  // },

  _handlePostCopyURL() {
    SnackbarActions
      .showMessage('The URL of the node has been copied to your clipboard.')
  },

  _handleEdit() {
    const {router} = this.context
    const {node} = this.props
    if (this.props.node.type.includes('Person')) {
      // Own profile
      ProfileActions.show()
    } else {
      // Edit node owned by user
      router.push(`/graph/${encodeURIComponent(node.uri)}/add/node`)
    }
  },

  _handleStartChat() {
    const {router} = this.context
    const {node} = this.props
    router.push(`/chat/new/${encodeURIComponent(node.uri)}`)
    graphActions.setState('activeNode', null, true)
  },

  _preventDefault(e) {
    e.stopPropagation()
    return false
  },

  getLuminanceForImageUrl(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        credentials: 'include'
      }).then(function (response) {
        return response.blob()
      })
        .then((imageBlob) => {
          let imgDataUrl = URL.createObjectURL(imageBlob)
          let img = new Image()
          img.crossOrigin = 'Anonymous'
          img.onload = () => {
            let canvas = document.createElement('CANVAS')
            canvas.setAttribute('width', img.width)
            canvas.setAttribute('height', img.height)
            canvas.width = canvas.style.width = img.width
            canvas.height = canvas.style.height = img.height
            let context = canvas.getContext('2d')
            context.drawImage(img, 0, 0)

            // Get top 75 pixels
            let imgData = context.getImageData(0, 0, img.width, 75)
            let lumsSum = 0
            let lumsLength = 0
            for (var i = 0; i < imgData.data.length; i += 4) {
              let r = imgData.data[i]
              let g = imgData.data[i + 1]
              let b = imgData.data[i + 2]
              let lum = (r + r + b + g + g + g) / 6
              lumsSum += lum
              lumsLength++
            }
            let lumsMean = lumsSum / lumsLength

            resolve(lumsMean)
          }

          img.src = imgDataUrl
        })
    })
  },

  render() {
    let styles = this.getStyles()
    let headerIcon
    if (!this.props.node.img) {
      if (this.props.node.confidential) {
        // Display confidential icon in header
        headerIcon = <ConfidIcon />
      } else if (this.props.node.type &&
          this.props.node.type.includes('Person')) {
        // Display person icon in header
        headerIcon = <PersonIcon />
      } else {
        // Display document icon in header (default)
        headerIcon = <DocIcon />
      }
    }

    // @TODO bind handlers to preset actions here
    // in: {name: 'disconnect'}
    // out: {name: 'disconnect',
    //    component: <Disconnect>, handler: disconnecthandler} (overwritable)
    // map ((e) return object.assign({}, default, e))

    // @TODO pass fab 0-3 and set which one is primary (flag?),
    //    or reverse? ['primary','other button', 'other button']

    // @TODO externalize fab handlers + component etc

    // Always add the fullscreen menu item

    if (this.state.luminance && this.state.luminance < 40) {
      styles.icon = Object.assign({}, styles.icon || {}, {color: 'white'})
    }
    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <Content>
            <div style={styles.container}>
              <div style={styles.headerIcon}>
                {headerIcon}
              </div>
              <AppBar
                onTouchTap={this._handleFull}
                style={styles.headers}
                iconElementRight={
                  <IconMenu
                    iconButtonElement={
                      <IconButton
                        iconClassName="material-icons"
                        iconStyle={styles.icon}>
                          more_vert
                      </IconButton>
                    }
                    onTouchTap={this._preventDefault}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}>

                      {this.props.menuItems.map((menuItem) => {
                        let menuItemInfo = this.getAction(menuItem)
                        if ('menuItem' in menuItemInfo) {
                          return menuItemInfo.menuItem
                        }
                        return (
                          <MenuItem
                            primaryText={menuItemInfo.title}
                            onTouchTap={menuItemInfo.handler} />
                        )
                      })}
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
                  {this.props.fabItems.map((fabItem, i) => {
                    let fabItemInfo = this.getAction(fabItem)
                    if ('fabItem' in fabItemInfo) {
                      return fabItemInfo.fabItem
                    }

                    let lastItem = i === this.props.fabItems.length - 1
                    return (
                      <FloatingActionButton
                        backgroundColor={!lastItem ? '#fff' : 'inherit'}
                        style={styles.fabBtn}
                        secondary={lastItem}
                        iconStyle={!lastItem ? styles.fabIcon : {}}
                        onTouchTap={this.getAction(fabItem).handler}>
                        {this.getAction(fabItem).icon}
                      </FloatingActionButton>
                    )
                  })}
              </div>
              <Subheader style={styles.subheader}>
                {
                  this.props.node.type.includes('Person')
                  ? 'Name'
                  : 'Title'
                }
              </Subheader>
              <h1 style={styles.title}>{this.props.title || 'No title'}</h1>
              <Divider style={styles.titleDivider} />
              {this.props.children}
            </div>
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(GenericFullScreen)
