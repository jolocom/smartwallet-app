import React from 'react'
import Reflux from 'reflux'

import {AppBar, IconButton} from 'material-ui'
import Dialog from 'components/common/dialog.jsx'
import {Layout, Content} from 'components/layout'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

export default React.createClass({

  mixins: [Reflux.connect(ContactStore, 'contact')],

  contextTypes: {
    history: React.PropTypes.any
  },

  componentDidMount() {
    ContactActions.load(this.props.params.username)
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  open() {
    this.refs.dialog.show()
  },

  close() {
    this.refs.dialog.hide()
  },

  toggle() {
    this.refs.dialog.toggle()
  },

  startChat() {
    this.context.history.pushState(null, `chat/user/${this.state.contact.username}`)
  },

  render() {
    let {contact} = this.state

    return (
      <Dialog ref="dialog" fullscreen={true} visible={this.state.open}>
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
      </Dialog>
    )
  }
})
