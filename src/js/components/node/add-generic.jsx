import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import {
  AppBar,
  IconButton,
  Card,
  CardMedia,
  FlatButton,
  TextField
} from 'material-ui'

import AddNodeIcon from 'components/icons/addNode-icon.jsx'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import nodeStore from 'stores/node'
import Util from 'lib/util'
import previewStore from 'stores/preview-store'
import graphActions from 'actions/graph-actions'
import {PRED} from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph.js'
import GraphPreview from './graph-preview.jsx'

// import NodeAddDefault from './add-default.jsx'
// import NodeAddLink from './add-link.jsx'
// import NodeAddImage from './add-image.jsx'

// let types = {
//   default: {
//     component: NodeAddDefault
//   },
//   link: {
//     component: NodeAddLink
//   },
//   image: {
//     title: 'Upload image',
//     component: NodeAddImage
//   }
// }

let NodeAddGeneric = React.createClass({
  mixins: [
    Reflux.connect(nodeStore, 'node'),
    Reflux.connect(previewStore, 'graphState')
  ],

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.any,
    node: React.PropTypes.any,
    muiTheme: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      type: 'default'
    }
  },

  componentDidMount() {
    this.refs.dialog.show()
    this.gAgent = new GraphAgent()
    this.listenTo(previewStore, this.getUser)
  },

  getUser(state) {
    // We need to know the uri of the currently centered node, this way we
    // deduce the Access Controll. Taking it from the graph preview.
    if (state.center) this.user = state.center.uri
  },

  close() {
    this.refs.dialog.hide()
    this.context.router.goBack()
  },

  validates() {
    let {title} = this.state
    return title && title.trim()
  },

  submit() {
    if (!this.validates()) return false
    let {title, description, image} = this.state
    if (this.state.graphState.user && this.state.graphState.center) {
      let currentUser = this.state.graphState.user
      let centerNode = this.state.graphState.center
      // let isConfidential = (this.state.type == 'confidential')
      // if (isConfidential) this.state.type = 'default'

      // @TODO Previously called nodeActions.create;
      // except it cannot have a return value
      this.gAgent.createNode(currentUser, centerNode, title, description, image,
        this.state.type, false).then((uri) => {
          graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
        })
    } else {
      // console.log('Did not work,logged in user or center node not detected
      // correctly.')
    }
  },

  getStyles() {
    const {muiTheme: {actionAppBar}} = this.context
    return {
      bar: {
        backgroundColor: actionAppBar.color,
        color: actionAppBar.textColor
      },
      title: {
        color: actionAppBar.textColor
      },
      icon: {
        color: actionAppBar.textColor
      },
      image: {
        height: '176px',
        backgroundColor: '#9ca0aa'
      },
      headerIcon: {
        position: 'absolute',
        zIndex: 1500,
        width: '200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: '0',
        right: '0',
        marginTop: '50px'
      },
      nodeTitle: {
        padding: '0 24px',
        color: '#4b132b',
        fontWeight: '100',
        fontSize: '1.5em'
      }
    }
  },

  // getTypeConfig(type) {
  //   return types[type] || types.default
  // },

  render: function() {
    let styles = this.getStyles()
    let title = 'Edit node'
    // let {type} = this.props.params
    // let config = this.getTypeConfig(type)
    // let title = config.title || `New ${type}`

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <div style={styles.headerIcon}>
            <AddNodeIcon />
          </div>
          <div style={{display: 'none'}}>
            <GraphPreview />
          </div>
          <AppBar
            title={title}
            titleStyle={styles.title}
            iconElementLeft={
              <IconButton
                iconStyle={styles.icon}
                iconClassName="material-icons"
                onTouchTap={this._handleClose}>close
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                style={styles.icon}
                label="Create"
                onTouchTap={this._handleSubmit}
              />
            }
            style={styles.bar}
          />
          <Content style={styles.content}>
            <Card>
              <CardMedia
                style={styles.image} />
            </Card>
            <TextField
              name="givenName"
              style={styles.nodeTitle}
              placeholder="Add node title"
              onChange={Util.linkToState(this, 'title')} />
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleSubmit() {
    this.submit()
    this.close()
  },

  _handleSuccess() {
    this.close()
  },

  _handleClose() {
    this.refs.dialog.hide()
    this.context.router.goBack()
  }
})

export default Radium(NodeAddGeneric)
