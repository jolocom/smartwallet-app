import rdf from 'rdflib'
import React from 'react'
import { connect } from 'redux/utils'
import Dialog from 'components/common/dialog'
import CopyToClipboard from 'react-copy-to-clipboard'
import nodeActions from 'actions/node'
import {Layout, Content} from 'components/layout'
import graphActions from 'actions/graph-actions'
// import Radium from 'radium'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import CommunicationChat from 'material-ui/svg-icons/communication/chat'
import ContentLink from 'material-ui/svg-icons/content/link'
import ContentUnlink from 'material-ui/svg-icons/communication/call-split'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import ShareIcon from 'material-ui/svg-icons/content/reply'
import DocIcon from 'components/icons/doc-icon.jsx'
import PersonIcon from 'components/icons/person-icon.jsx'
import SnackbarActions from 'actions/snackbar'

import {
  AppBar,
  IconButton,
  IconMenu,
  MenuItem,
  Divider,
  Subheader
} from 'material-ui'

class GenericFullScreen extends React.Component {
  static propTypes = {
    type: React.PropTypes.string,
    rank: React.PropTypes.string,
    title: React.PropTypes.string,
    menuItems: React.PropTypes.arrayOf(React.PropTypes.string),
    headerColor: React.PropTypes.any,
    fabItems: React.PropTypes.arrayOf(React.PropTypes.string),
    copyToClipboardText: React.PropTypes.any,
    description: React.PropTypes.string,
    children: React.PropTypes.any,
    backgroundImg: React.PropTypes.any,
    uri: React.PropTypes.string,
    graphState: React.PropTypes.object,
    centerWritePerm: React.PropTypes.bool,
    openConfirmDialog: React.PropTypes.func,
    showDialog: React.PropTypes.func,
    hideDialog: React.PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.any.isRequired,
    node: React.PropTypes.object,
    muiTheme: React.PropTypes.object,
    account: React.PropTypes.object,
    store: React.PropTypes.object
  }

  constructor() {
    super()
    this.state = { fullscreen: false }
  }

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
        // console.error('Couldn\'t compute luminance', e)
      })
    }
    this.showDialog('fullscreen')
  }

  componentWillUnmount() {
    nodeActions.resetState()
  }

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
        boxShadow: 'inset 0px 65px 80px -15px rgba(0,0,0,0.6)'
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
      icon: {
        color: 'white'
      },
      subheader: {
        marginTop: '40px',
        paddingLeft: '24px',
        lineHeight: '20px'
      }
    }
  }

  _handleClose() {
    nodeActions.resetState()
    this.context.router.goBack()
  }

  _handlePrivacySettings() {
    this.context.router.push(encodeURIComponent(this.props.uri) +
      '/privacy-settings')
  }

  _handleViewSharedNodes() {
    this.context.router.push(encodeURIComponent(this.props.uri) +
      '/shared-nodes')
  }

  _handleDisconnect() {
    if (this.props.rank === 'center') {
      this._handleClose()
    } else {
      /*
        We do this so that we can disconnect all occurances
        of the node we are disconnecting.
      */
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

      this.props.openConfirmDialog({
        message: 'Are you sure you want to disconnect this node ?',
        primaryActionText: 'Disconnect',
        callback: () => {
          this._handleClose()
          nodeActions.disconnectNode(payload)
          let onDisconnectUndo = () => {
            let center = this.context.node.uri
            nodeActions.link(center, 'knows', this.props.uri, center)
          }

          SnackbarActions.showMessageUndo(
              'The node has been successfully disconnected',
              onDisconnectUndo)
        }
      })
    }
  }

  _handleConnect() {
    nodeActions.link(this.context.account.webId, 'generic', this.props.uri)
    SnackbarActions.showMessage('You are now connected to the node.')
    this._handleClose()
  }

  // TODO - break into more actions. The animation should be smoother.
  _handleDelete() {
    this.props.openConfirmDialog({
      message: 'Are you sure you want to delete this node ?',
      primaryActionText: 'Delete',
      callback: () => {
        let navHis = this.props.graphState.navHistory
        let centerNode = this.context.node
        let currentNode = { uri: this.props.uri }
        if (this.props.uri === this.props.graphState.center.uri) {
          let historyNode = navHis[navHis.length - 1]
          this._handleClose()
          graphActions.drawAtUri(historyNode.uri, 1)
          nodeActions.remove(currentNode, historyNode)
        } else {
          this._handleClose()
          nodeActions.remove(
            currentNode,
            centerNode,
            this.props.centerWritePerm)
        }
      }
    })
  }

  _handleFull() {
    this.setState({fullscreen: !this.state.fullscreen})
  }

  // menuItem (optional?)
  getAction(iconString, i) {
    switch (iconString) {
      case 'chat':
        return {
          title: 'Chat',
          icon: <CommunicationChat />,
          handler: () => this._handleStartChat()}
      case 'delete':
        return {
          title: 'Delete',
          handler: () => this._handleDelete()}
      case 'connect':
        return {
          title:
          'Connect',
          icon: <ContentLink />,
          handler: () => this._handleConnect()
        }
      case 'disconnect':
        return {
          title:
          'Disconnect',
          icon: <ContentUnlink />,
          handler: () => this._handleDisconnect()
        }
      case 'edit':
        return {
          title: 'Edit',
          handler: () => this._handleEdit(),
          icon: <EditorModeEdit />
        }
      case 'privacySettings':
        return {
          title: 'Privacy Settings',
          handler: () => this._handlePrivacySettings()
        }
      case 'viewSharedNodes':
        const obj = {
          handler: () => this._handleViewSharedNodes(),
          title: 'View shared nodes'
        }
        if (this.props.title) {
          obj.title = `Shared with ${this.props.title}`
        }

        return obj
      case 'fullscreen':
        return {
          handler: () => this._handleFull(),
          title: this.state.fullscreen ? 'Exit full screen' : 'Full screen'
        }
      case 'copyUrl': // @TODO not optimal
        return {
          icon: <ShareIcon />,
          menuItem: (
            <CopyToClipboard
              key={i}
              text={this.props.copyToClipboardText}
              onCopy={this._handlePostCopyURL}
            >
              <MenuItem primaryText="Copy URL" />
            </CopyToClipboard>),
          fabItem: (
            <CopyToClipboard
              key={i}
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
        return {}
    }
  }

  _handlePostCopyURL() {
    SnackbarActions
      .showMessage('The URL of the node has been copied to your clipboard.')
  }

  _handleEdit() {
    this.context.router.push('/profile')
  }

  _handleStartChat() {
    const {router} = this.context
    router.push(`/chat/new/${encodeURIComponent(this.props.uri)}`)
  }

  _preventDefault(e) {
    e.stopPropagation()
    return false
  }

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
  }

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

    const onTouchTapHandler = () => this._handleFull()
    const onClickHandler = () => this._handleClose()
    return (
      <Dialog fullscreen>
        <Layout>
          <Content>
            <div style={styles.container}>
              <div style={styles.headerIcon}>
                {headerIcon}
              </div>
              <AppBar
                onTouchTap={onTouchTapHandler}
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
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  >
                    {this.props.menuItems.map((menuItem, i) => {
                      let menuItemInfo = this.getAction(menuItem, i)
                      if ('menuItem' in menuItemInfo) {
                        return menuItemInfo.menuItem
                      }
                      return (
                        <MenuItem
                          key={i}
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
                    onClick={onClickHandler}>
                      arrow_back
                  </IconButton>
                  }
              />
              <div style={styles.floatingButtons}>
                {this.props.fabItems.map((fabItem, i) => {
                  let fabItemInfo = this.getAction(fabItem, i)
                  if ('fabItem' in fabItemInfo) {
                    return fabItemInfo.fabItem
                  }

                  let lastItem = i === this.props.fabItems.length - 1
                  return (
                    <FloatingActionButton
                      key={i}
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
                  this.props.type && this.props.type.includes('Person')
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
}

export default connect({
  actions: [
    'confirmation-dialog:openConfirmDialog',
    'common/dialog:showDialog', 'common/dialog:hideDialog'
  ]
})(GenericFullScreen)
