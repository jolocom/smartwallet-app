import React from 'react'
import Radium from 'radium'

import {AppBar, IconButton, FlatButton} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeAddDefault from './add-default.jsx'
import NodeAddImage from './add-image.jsx'

let types = {
  default: {
    component: NodeAddDefault
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
        // backgroundColor: grey500
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
            iconElementLeft={<IconButton iconClassName="material-icons" onTouchTap={this._handleClose}>close</IconButton>}
            iconElementRight={<FlatButton label="Create" onTouchTap={this._handleSubmit}/>}
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
