import React from 'react'
import Radium from 'radium'

import {
  AppBar,
  IconButton,
  Card,
  CardMedia,
  FlatButton
} from 'material-ui'

import AddNodeIcon from 'components/icons/addNode-icon.jsx'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

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

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.any,
    node: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  close() {
    this.refs.dialog.hide()
    this.context.router.goBack()
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
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleSubmit() {
    this.refs.form.submit()
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
