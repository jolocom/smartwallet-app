import React from 'react'
import Radium from 'radium'

import {
  AppBar,
  IconButton,
  TextField,
  Card,
  CardMedia,
  FlatButton,
  RaisedButton
} from 'material-ui'

import ActionDescription from 'material-ui/svg-icons/action/description'
import CommunicationEmail from 'material-ui/svg-icons/communication/email'
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeAddDefault from './add-default.jsx'
import NodeAddLink from './add-link.jsx'
import NodeAddImage from './add-image.jsx'

let types = {
  default: {
    component: NodeAddDefault
  },
  link: {
    component: NodeAddLink
  },
  image: {
    title: 'Upload image',
    component: NodeAddImage
  }
}

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
      }
    }
  },

  getTypeConfig(type) {
    return types[type] || types.default
  },

  render: function() {
    let styles = this.getStyles()
    let {node, type} = this.props.params
    let config = this.getTypeConfig(type)
    let title = config.title || `New ${type}`

    let Component = config.component

    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
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
            <Card rounded={false}>
              <CardMedia />
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
