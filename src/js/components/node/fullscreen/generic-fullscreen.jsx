import rdf from 'rdflib'
import React from 'react'
import Dialog from 'components/common/dialog'
import CopyToClipboard from 'react-copy-to-clipboard'
import nodeActions from 'actions/node'
import {Layout, Content} from 'components/layout'
import ProfileActions from 'actions/profile'
import ConfirmActions from 'actions/confirm'
import Radium from 'radium'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import CommunicationChat from 'material-ui/svg-icons/communication/chat'
import ContentLink from 'material-ui/svg-icons/content/link'
import ContentUnlink from 'material-ui/svg-icons/communication/call-split'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ShareIcon from 'material-ui/svg-icons/content/reply'
import DocIcon from 'components/icons/doc-icon.jsx'
import PersonIcon from 'components/icons/person-icon.jsx'
import SnackbarActions from 'actions/snackbar'

import {AppBar, IconButton, IconMenu, MenuItem, Divider} from 'material-ui'

let GenericFullScreen = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    menuItems: React.PropTypes.arrayOf(React.PropTypes.string),
    headerColor: React.PropTypes.any,
    fabItems: React.PropTypes.arrayOf(React.PropTypes.string),
    copyToClipboardText: React.PropTypes.any,
    description: React.PropTypes.string,
    children: React.PropTypes.any,
    backgroundImg: React.PropTypes.any,
    rank: React.PropTypes.string,
    uri: React.PropTypes.string,
    graphState: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.any,
    node: React.PropTypes.object,
    muiTheme: React.PropTypes.object,
    account: React.PropTypes.object
  },

  componentWillMount() {
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
        this.setState({luminance: lum})
      }).catch((e) => {
        console.error('Couldn\'t compute luminance', e)
      })
    }
    this.refs.dialog.show()
  },

  componentWillUnmount() {
    nodeActions.resetState()
  },

  getStyles() {
    return {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
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
        marginTop: '30px',
        fontWeight: '100'
      },
      titleDivider: {
        marginLeft: '24px',
        marginTop: '10px'
      },
      floatingButtons: {
        position: 'absolute',
        top: this.state.fullscreen ? '90vh' : '40vh',
        right: '10px',
        marginTop: '-28px',
        zIndex: 1500
      },
      fabBtn: {
        margin: '0px 10px'
      },
      fabIcon: {
        fill: '#9a3460'
      },
      headerIcon: {
        position: 'absolute',
        zIndex: 1500,
        width: '100px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        marginTop: '15vh'
      }
    }
  },

  _handleClose() {
    nodeActions.resetState()
    this.context.router.goBack()
  },

  // WORKING ON THIS STILL TODO
  _handleDisconnect() {
    if (this.props.rank === 'center') {
      this._handleClose()
    } else {
      let payload = {
        uri: this.context.node.uri,
        triples: []
      }

      this.props.graphState.neighbours.map(el => {
        if (el.rank === this.props.rank && el.uri === this.props.uri) {
          payload.triples.push({
            subject: rdf.sym(this.context.node.uri),
            predicate: rdf.sym(el.connection),
            object: rdf.sym(el.uri)
          })
        }
      })

      ConfirmActions.confirm(
        'Are you sure you want to disconnect this node ?',
        'Disconnect',
        () => {
          this._handleClose()
          nodeActions.disconnectNode(payload)
          let onDisconnectUndo = () => {
          // TODO - make sure this renders somehow
            nodeActions.link(this.context.node.uri, 'knows',
                             this.props.uri, false)
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
    nodeActions.link(this.context.account.webId, 'generic', this.props.uri)
    SnackbarActions.showMessage('You are now connected to the node.')
    this._handleClose()
  },

  _handleDelete() {
    // let node = this.props.state.activeNode
    let center = this.props.state.center
    let navHis = this.props.state.navHistory

    if (node.rank === 'center') {
      let prev = navHis[navHis.length - 1]
      debug('Deleting center node; navigating to previous node',prev.uri)
      // graphActions.drawAtUri(prev.uri, 1)
      this.context.router.push(`/graph/${encodeURIComponent(prev.uri)}`)
      nodeActions.remove(node, prev) // will refresh the graph
    } else {
      this.context.router.push(`/graph/${encodeURIComponent(center.uri)}`)
      nodeActions.remove(node, center)
    }
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
      default:
        console.error('No action info found for', iconString)
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
    ProfileActions.show()
  },

  _handleStartChat() {
    const {router} = this.context
    const {node} = this.props
    router.push(`/chat/new/${encodeURIComponent(node.uri)}`)
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

    if (this.props.backgroundImg === 'none') {
      if (this.props.type && this.props.type.includes('Person')) {
        headerIcon = <PersonIcon />
      } else {
        headerIcon = <DocIcon />
      }
    }

    if (this.state.luminance && this.state.luminance < 40) {
      styles.icon = Object.assign({}, styles.icon || {}, {color: 'white'})
    }
    return (
      <Dialog ref='dialog' fullscreen>
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
