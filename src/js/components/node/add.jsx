import React from 'react'
import Radium from 'radium'

import {AppBar, IconButton, FlatButton} from 'material-ui'

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

let NodeAdd = React.createClass({

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.any
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  close() {
    this.refs.dialog.hide()
    this.context.history.goBack()
  },

  getStyles() {
    return {
      bar: {
          backgroundColor: '#b3c90f'
      },
      icon: {
          color: 'white'
      },
      title: {
          color: 'white'
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
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <AppBar
            title={title}
            titleStyle={styles.title}
            iconElementLeft={<IconButton iconStyle={styles.icon} iconClassName="material-icons" onTouchTap={this._handleClose}>close</IconButton>}
            iconElementRight={<FlatButton style={styles.icon} label="Create" onTouchTap={this._handleSubmit}/>}
            style={styles.bar}
          />
          <Content style={styles.content}>
            <Component ref="form" node={node} onSuccess={this._handleSuccess}/>
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
    this.context.history.goBack()
  }
})

export default Radium(NodeAdd)
