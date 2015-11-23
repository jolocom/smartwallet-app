import React from 'react'
import {Button} from 'react-mdl'
import {Navigation} from 'react-router'

import {linkToState} from 'lib/util'

// login for development
let LoginDev = React.createClass({
  mixins: [
    Navigation
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      username: ''
    }
  },
  login() {
    localStorage.setItem('fake-user', this.state.username)
    this.transitionTo('/')
  },
  render() {
    return (
      <div className="jlc-login">
        <input name="username" onChange={linkToState(this, 'username')} />
        <fieldset>
          <Button primary={true} raised={true} onClick={this.login}>Login</Button>
        </fieldset>
      </div>
    )
  }
})

export default LoginDev
