import React from 'react'
import {RaisedButton} from 'material-ui'
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
          <RaisedButton onTouchTap={this.login}>Login</RaisedButton>
        </fieldset>
      </div>
    )
  }
})

export default LoginDev
