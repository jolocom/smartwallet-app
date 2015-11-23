import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'

import {AppBar, IconButton} from 'material-ui'
import {Layout, Content} from 'components/layout'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

export default React.createClass({

  mixins: [Reflux.connect(ContactStore)],

  contextTypes: {
    history: React.PropTypes.any
  },

  getInitialState() {
    return {
      open: false
    }
  },

  componentDidMount() {
    ContactActions.load(this.props.params.username)
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  open() {
    this.setState({open: true})
  },

  close() {
    this.setState({open: false})
  },

  toggle() {
    this.setState({open: !this.state.open})
  },

  startChat() {
    this.context.history.pushState(null, `chat/user/${this.state.username}`)
  },

  render() {
    let classes = classNames('jlc-chat-user', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let contact = this.state

    return (
      <div className={classes}>
        <Layout>
          <AppBar
            title={contact.name}
            iconElementLeft={
              <IconButton onClick={() => this.context.history.pushState(null, '/contacts')} iconClassName="material-icons">arrow_back</IconButton>
            }
            iconElementRight={<IconButton onTouchTap={this.startChat}>message</IconButton>}
          />

          <Content>

          </Content>
        </Layout>
      </div>
    )
  }
})
