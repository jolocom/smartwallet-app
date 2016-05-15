import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {TextField, RaisedButton, Paper} from 'material-ui'
import {History, Lifecycle, Link} from 'react-router'

import Availability from 'actions/availability'
import AvailabilityStore from 'stores/availability'

import Account from 'actions/account'
import AccountStore from 'stores/account'

import Util from 'lib/util'

let Signup = React.createClass({
  mixins: [
    History,
    Lifecycle,
    Reflux.connect(AvailabilityStore, 'available'),
    Reflux.connect(AccountStore, 'account')
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },
  componentWillMount() {
    if (this.state.account && this.state.account.username)
      this.history.pushState(null, '/graph')
  },
  routerWillLeave() {
    // if (!this.state.signedUp)
    //   return false
  },
  signup() {
    let signupData = {
      username: this.state.username,
      name: this.state.name,
      password: this.state.password,
      email: this.state.email
    }
    Account.signup(signupData)
  },

  componentDidUpdate() {
    if (this.state.account && this.state.account.username) {
      this.history.pushState(null, '/graph')
    }
  },

  _onUsernameChange(e) {
    this.setState({
      username: e.target.value
    })
    Availability.check(e.target.value)
  },
  render() {
    let availableText, disabled = true

    if (this.state.available === false) {
      availableText = 'This username is already taken.'
    }

    disabled = this.state.available !== true || !this.state.username

    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <img src="/img/logo.png" style={styles.logo} />
          <h2 style={styles.title}>Signup for Jolocom</h2>
        </header>
        <Paper zDept={2} style={styles.content}>
          <div>
            <TextField floatingLabelText="Username"
              onChange={this._onUsernameChange}
              errorText={availableText}/>
            <TextField floatingLabelText="Password" type="password"
              onChange={Util.linkToState(this, 'password')} />
            <TextField floatingLabelText="Name"
              onChange={Util.linkToState(this, 'name')} />
            <TextField floatingLabelText="Email"
              onChange={Util.linkToState(this, 'email')} />
          </div>

          <RaisedButton primary={true} onTouchTap={this.signup} disabled={disabled} style={styles.button}>Sign up</RaisedButton>
        </Paper>
        <p>Already have an account? <Link to="/login">login instead</Link>.</p>
      </div>
    )
  }
})

let styles = {
  container: {
    textAlign: 'center',
    background: '#f1f1f1',
    height: '100%',
    overflowY: 'auto'
  },
  header: {
    padding: '40px'
  },
  logo: {
    width: '80px',
    height: '80px'
  },
  title: {
    fontWeight: '200',
    fontSize: '20px'
  },
  content: {
    width: '300px',
    maxWidth: '90%',
    padding: '20px',
    margin: '0 auto 20px auto',
    background: '#ffffff',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%'
  }
}

export default Radium(Signup)
