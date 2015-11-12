import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'

import {
  Layout,
  IconButton,
  Spacer,
  Content
} from 'react-mdl'

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
    this.context.history.pushState(null, `chat/user/${this.state.contact.username}`)
  },

  render() {
    let classes = classNames('jlc-chat-user', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let {contact} = this.state

    return (
      <div className={classes}>
        <Layout>
          <header className="mdl-layout__header">
            <IconButton name="close" onClick={() => this.context.history.pushState(null, '/contacts')} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">{contact.username}</span>
              <Spacer></Spacer>
              <IconButton name="message" onClick={this.startChat}></IconButton>
            </div>
          </header>
          <Content>

          </Content>
        </Layout>
      </div>
    )
  }
})
