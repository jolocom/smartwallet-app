import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import {AppBar, IconButton, FlatButton} from 'material-ui'

import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import NodeAddDefault from './add-default.jsx'
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
  mixins: [Reflux.listenTo(PreviewStore, 'onStoreUpdate', 'initialState')],

  propTypes: {
    params: React.PropTypes.object,
    center: React.PropTypes.object,
    neighbours: React.PropTypes.array
  },

  contextTypes: {
    router: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  initialState(state) {
    this.setState({graphState: state})
  },

  onStoreUpdate(newState) {
    this.setState({graphState: newState})
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  close() {
    // TODO
    // this.refs.dialog.hide()
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

  render: function() {
    let selectedNode
    if (this.props.center.uri === this.props.params.node) {
      selectedNode = this.props.center
    } else {
      selectedNode = this.props.neighbours.find(el => {
        return el.uri === this.props.params.node
      })
    }

    let styles = this.getStyles()
    let {type} = this.props.params

    let config = types[type] || types.default
    let title = config.title || `New ${type}`

    let Component = config.component

    return (
      <Dialog ref='dialog' fullscreen>
        <Layout>
          <AppBar
            title={title}
            titleStyle={styles.title}
            iconElementLeft={
              <IconButton
                iconStyle={styles.icon}
                iconClassName='material-icons'
                onTouchTap={this._handleClose}>close
              </IconButton>
            }
            iconElementRight={
              <FlatButton
                style={styles.icon}
                label='Create'
                onTouchTap={this._handleSubmit}
              />
            }
            style={styles.bar}
          />
          <Content style={styles.content}>
            <Component ref='form'
              node={selectedNode}
              onSuccess={this._handleSuccess}
              graphState={this.state.graphState} />
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
    this.context.router.goBack()
  }
})

export default Radium(NodeAdd)
