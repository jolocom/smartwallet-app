import React from 'react'
import Radium from 'radium'
import { connect, actionsFrom } from 'redux/utils'
import { RaisedButton, TextField, IconButton, AppBar } from 'material-ui'
import { Link } from 'react-router'

import Utils from 'lib/util'

// login for development
const Login = connect({
  props: ['account.login', 'account.emailUpdateQueued'],
  actions: actionsFrom('account/login',
    ['doLogin', 'setUsername', 'setPassword']
  )
})(React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    account: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    login: React.PropTypes.object.isRequired,
    emailUpdateQueued: React.PropTypes.bool.isRequired,
    doLogin: React.PropTypes.func.isRequired,
    setUsername: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      username: '',
      password: '',
      userErrorMsg: '',
      pwErrorMsg: ''
    }
  },

  componentWillMount() {
    const {account} = this.context
    if (account && account.webId) {
      this.context.router.push('/graph')
    }
  },

  goBack() {
    this.context.router.push('/')
  },

  login(e) {
    this.props.doLogin({
      username: this.props.login.username,
      password: this.props.login.password,
      updateUserEmail: this.props.emailUpdateQueued
    })
    e.preventDefault()
  },

  _handleUsernameChange(e) {
    this.props.setUsername({
      username: e.target.value.toLowerCase()
    })
  },

  _handlePasswordChange(e) {
    this.props.setPassword({
      password: e.target.value
    })
  },

  getStyles() {
    let {muiTheme} = this.context
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f8f9fb',
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
        textTransform: 'uppercase'
      },
      logoImg: {
        maxWidth: '80%',
        width: '256px'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left'
      },
      content: {
        width: '300px',
        maxWidth: '90%',
        padding: '0px 20px 20px',
        margin: '10px auto 20px auto',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff'
      },
      safariCookieWarning: {
        fontWeight: 'bold',
        padding: '0 20px',
        marginBottom: '1em'
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
      },
      forgotPassword: {
        float: 'right',
        padding: '10px',
        color: '#7B8288',
        fontSize: '0.75em'
      }
    }

    return styles
  },
  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <AppBar
          title="Log in"
          style={{boxShadow: 'none'}}
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName="material-icons">
              arrow_back
          </IconButton>}
          />
        <div style={styles.logo}>
          <img src="/img/logo_littlesister.svg" style={styles.logoImg} />
        </div>
        <form style={styles.content} onSubmit={this.login}>
          <div style={{marginBottom: '20px'}}>
            <div>
              {/** TODO Give user feedback when user already exists **/}
              <TextField
                floatingLabelText="Username"
                value={this.props.login.username}
                type="text"
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="none"
                errorText={this.props.login.userErrorMsg}
                onChange={this._handleUsernameChange} />
              <TextField
                floatingLabelText="Password"
                type="password"
                errorText={this.props.login.pwErrorMsg}
                onChange={this._handlePasswordChange} />
              <Link
                to="/forgot-password"
                style={styles.forgotPassword}>Forgot password?</Link>
            </div>
          </div>
          <RaisedButton
            type="submit"
            secondary
            style={styles.button}
            label="Login" />
        </form>
        <div style={{paddingBottom: '8px', color: 'red'}}>
          {this.props.login.failureMsg}
        </div>
        {
        Utils.isSafari()
          ? <p style={styles.safariCookieWarning}>In order for the
          application to work with Safari,
          please go to the privacy settings of your browser
          and choose "Allow cookies for all websites".
          </p>
        : ''
        }
        <p style={styles.help}>Don't have an account yet?&nbsp;
          <Link to="/signup" style={styles.link}>Sign up</Link>.
        </p>
      </div>
    )
  }
}))

export default Radium(Login)
