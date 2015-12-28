import React from 'react'
import {RaisedButton, TextField} from 'material-ui'
import {History, Link} from 'react-router'

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
    if (localStorage.getItem('fake-user')) {
      this.history.pushState(null, '/')
    }
  },
  login() {
    localStorage.setItem('fake-user', this.state.username)
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
          <h2>Jolocom Login</h2>
        </header>
        <main className="jlc-login-content mdl-shadow--2dp">
          <TextField floatingLabelText="Username" onChange={this._handleUsernameChange} />
          <fieldset>
            <RaisedButton primary={true} onTouchTap={this.login}>Login</RaisedButton>
          </fieldset>
        </main>
        <p>Don't have an account yet? <Link to="/signup">Sign up</Link>.</p>
      </div>
    )
  }
})

export default LoginDev
