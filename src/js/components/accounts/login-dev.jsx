import React from 'react/addons'
import {Button} from 'react-mdl'
import {Navigation} from 'react-router'

// login for development
let LoginDev = React.createClass({
  mixins: [
    Navigation,
    React.addons.LinkedStateMixin
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
        <input name="username" valueLink={this.linkState('username')} />
        <fieldset>
          <Button primary={true} raised={true} onClick={this.login}>Login</Button>
        </fieldset>
      </div>
    )
  }
})

export default LoginDev
