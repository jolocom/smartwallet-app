import React from 'react'
import classNames from 'classnames'

import {AppBar, IconButton, TextField, Styles} from 'material-ui'
import {Layout, Content} from 'components/layout'

let {Colors} = Styles

import NodeActions from 'actions/node'

import {linkToState} from 'lib/util'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any,
    node: React.PropTypes.string
  },

  getInitialState() {
    return {
      show: false
    }
  },

  componentDidMount() {
    this.show()
  },

  show() {
    this.setState({
      show: true
    })
  },

  close() {
    this.context.history.goBack()
  },

  onSubmit() {
    NodeActions.add(this.props.params.node, 'https://localhost:8443/eelco/profile/card#me', {
      title: this.state.title,
      description: this.state.description
    }).then(() => {
      this.close()
    })
  },

  getStyles() {
    return {
      bar: {
        backgroundColor: Colors.grey500
      }
    }
  },

  render: function() {
    let classes = classNames('jlc-node-add', 'jlc-dialog' , 'jlc-dialog__fullscreen', {
      'is-opened': this.state.show
    })

    let styles = this.getStyles()

    let type = this.props.params.type

    let title = `Add ${type}`

    return (
      <div className={classes}>
        <Layout>
          <AppBar
            title={title}
            iconElementLeft={<IconButton iconClassName="material-icons" onTouchTap={this.close}>arrow_back</IconButton>}
            iconElementRight={<IconButton iconClassName="material-icons" onTouchTap={this.onSubmit}>check</IconButton>}
            style={styles.bar}
          />
          <Content>
            <TextField floatingLabelText="Title"
              onChange={linkToState(this, 'title')} />
            <TextField floatingLabelText="Description"
              onChange={linkToState(this, 'description')} />
          </Content>
        </Layout>
      </div>
    )
  }
})
