import React from 'react'
import {RaisedButton, TextField} from 'material-ui'
import {History, Link} from 'react-router'

import Account from 'actions/account'
import AccountStore from 'stores/account'

// login for development
let LoginDev = React.createClass({
  mixins: [
    History
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      username: ''
    }
  },
  componentWillMount() {
    if (AccountStore.loggedIn()) {
      this.history.pushState(null, '/')
    }
  },
  login() {
    Account.login(this.state.username)
    this.history.pushState(null, '/')
  },
  _handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    })
  },
  render() {
    return (
      <div className="jlc-login">
        <header className="jlc-login-header">
          <img src="/img/logo.png" className="jlc-logo" />
        </header>
        <main className="jlc-login-content mdl-shadow--2dp">
          <fieldset>
            <TextField floatingLabelText="Username" onChange={this._handleUsernameChange} />
          </fieldset>
          <RaisedButton secondary={true} onTouchTap={this.login} style={{width: '100%'}}>Login</RaisedButton>
        </main>
        <p>Don't have an account yet? <Link to="/signup">Sign up</Link>.</p>
      </div>
    )
  }
})

export default LoginDev
