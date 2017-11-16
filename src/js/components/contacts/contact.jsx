import React from 'react'
import Reflux from 'reflux'

import Dialog from 'components/common/dialog.jsx'
import { connect } from 'redux_state/utils'
import {Layout} from 'components/layout'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

import Profile from '../node/fullscreen/types/profile'

export default connect({
  actions: ['common/dialog:showDialog', 'common/dialog:hideDialog']
})(React.createClass({

  mixins: [Reflux.connect(ContactStore, 'contact')],

  propTypes: {
    params: React.PropTypes.object,
    showDialog: React.PropTypes.func.isRequired,
    hideDialog: React.PropTypes.func.isRequired
  },

  contextTypes: {
    router: React.PropTypes.any
  },

  componentDidMount() {
    ContactActions.load(this.props.params.username)
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  open() {
    this.props.showDialog(this.props.params.username)
  },

  close() {
    this.props.hideDialog(this.props.params.username)
    this.context.router.push('/contacts')
  },

  toggle() {
    this.refs.dialog.toggle()
  },

  render() {
    let {contact} = this.state

    return (
      <Dialog id={this.props.params.username}
        visible={this.state.open} fullscreen
      >
        <Layout>
          <Profile node={contact} onClose={this.close} />
        </Layout>
      </Dialog>
    )
  }
}))
