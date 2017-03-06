import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import { connect } from 'redux/utils'

import {AppBar, IconButton, FlatButton} from 'material-ui'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'
import Loading from 'components/common/loading'

import NodeAddDefault from './add-generic.jsx'
import NodeAddLink from './add-link.jsx'
import NodeAddImage from './add-image.jsx'
import PreviewStore from 'stores/preview-store'

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
  mixins: [
    Reflux.listenTo(PreviewStore, 'onStoreUpdate', 'initialState')
  ],

  propTypes: {
    params: React.PropTypes.object,
    center: React.PropTypes.object,
    neighbours: React.PropTypes.array,
    showDialog: React.PropTypes.func.isRequired,
    hideDialog: React.PropTypes.func.isRequired
  },

  contextTypes: {
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {graphState: null}
  },

  initialState(state) {
    this.setState({graphState: state})
  },

  onStoreUpdate(newState) {
    this.setState({graphState: newState})
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

  render() {
    let styles = this.getStyles()
    let {type} = this.props.params

    let config = types[type] || types.default
    let title = config.title || `New ${type}`

    let Component = config.component

    let content
    if (this.state.graphState) {
      content = (
        <Component ref="form"
          node={this.props.center}
          onSuccess={this._handleSuccess}
          graphState={this.state.graphState}
        />
      )
    } else {
      content = <Loading />
    }

    return (
      <Dialog id="add_node" visible fullscreen>
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
            {content}
          </Content>
        </Layout>
      </Dialog>
    )
  },

  _handleSubmit() {
    let formInstance = this.refs.form
    if (formInstance.getWrappedInstance) {
      formInstance = formInstance.getWrappedInstance()
    }

    formInstance.submit()
    this._handleClose()
  },

  _handleClose() {
    this.context.router.goBack()
  }
})

export default connect({
  actions: ['common/dialog:showDialog', 'common/dialog:hideDialog']
})(Radium(NodeAdd))
