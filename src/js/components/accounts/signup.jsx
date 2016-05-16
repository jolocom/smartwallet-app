import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {TextField, RaisedButton} from 'material-ui'
import {History, Link} from 'react-router'

import Availability from 'actions/availability'
import AvailabilityStore from 'stores/availability'

import Account from 'actions/account'
import AccountStore from 'stores/account'

import Util from 'lib/util'

let Signup = React.createClass({
  mixins: [
    History,
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

  getStyles() {
    let {muiTheme} = this.context
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
        fontSize: '18px',
        fontWeight: '400',
        textAlign: 'center',
        marginTop: '24px',
        textTransform: 'uppercase'
      },
      logoImg: {
        width: '32px',
        height: '32px',
        verticalAlign: 'middle'
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
        boxSizing: 'border-box'
      },
      button: {
        width: '100%'
      },
      help: {
        color: muiTheme.jolocom.gray1
      },
      link: {
        color: muiTheme.palette.accent1Color,
        fontWeight: 'bold'
      }
    }

    return styles
  },

  render() {
    let styles = this.getStyles()

    let availableText, disabled = true
    console.log(this.state.available)
    if (this.state.available === false) {
      availableText = 'This username is already taken.'
    }

    disabled = this.state.available !== true || !this.state.username

    return (
      <div style={styles.container}>
        <div style={styles.logo}><img src="/img/logo.png" style={styles.logoImg}/> Jolocom</div>
        <div style={styles.content}>
          <div style={{marginBottom: '20px'}}>
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

          <RaisedButton secondary={true} onTouchTap={this.signup} disabled={disabled} style={styles.button} label="Sign up"/>
        </div>

        <p style={styles.help}>Already have an account? <Link to="/login" style={styles.link}>login instead</Link>.</p>
      </div>
    )
  }
})

export default Radium(Signup)
