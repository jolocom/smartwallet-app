import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'
import { IconButton, AppBar } from 'material-ui'
import { Link } from 'react-router'

import Utils from 'lib/util'

import {theme} from 'styles'

import {routes} from 'routes'

import LoginForm from 'components/common/login-form'

// login for development
const Login = connect({
  props: ['account', 'account.login', 'account.emailUpdateQueued'],
  actions: [
    'account:doLogin',
    'account:setLoginUsername',
    'account:setLoginPassword',
    'router:pushRoute'
  ]
})(Radium(React.createClass({

  propTypes: {
    login: React.PropTypes.object.isRequired,
    account: React.PropTypes.object.isRequired,
    emailUpdateQueued: React.PropTypes.bool.isRequired,
    pushRoute: React.PropTypes.func.isRequired,
    doLogin: React.PropTypes.func.isRequired,
    setLoginUsername: React.PropTypes.func.isRequired,
    setLoginPassword: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    const {account} = this.props
    if (account && account.webId) {
      this.props.pushRoute(routes.home)
    }
  },

  goBack() {
    this.props.pushRoute('/')
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
    this.props.setLoginUsername({
      username: e.target.value.toLowerCase()
    })
  },

  _handlePasswordChange(e) {
    this.props.setLoginPassword({
      password: e.target.value
    })
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f8f9fb',
        paddingBottom: '40px',
        boxSizing: 'border-box',
        minHeight: '100%'
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
        width: '100px'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left'
      },
      safariCookieWarning: {
        padding: '0 20px',
        marginBottom: '1em',
        color: theme.jolocom.gray1
      },
      help: {
        color: theme.jolocom.gray1
      },
      link: {
        color: theme.palette.accent1Color,
        fontWeight: 'bold'
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
          <img src="/img/logo.svg" style={styles.logoImg} />
        </div>
        <div style={{paddingBottom: '8px', color: '#e8540c'}}>
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
        <LoginForm
          onSubmit={this.login}
          username={this.props.login.username}
          usernameError={this.props.login.userErrorMsg}
          onUsernameChange={this._handleUsernameChange}
          passwordError={this.props.login.pwErrorMsg}
          onPasswordChange={this._handlePasswordChange}
        />

        <p style={styles.help}>Don't have an account yet?&nbsp;
          <Link to={routes.signup} style={styles.link}>Sign up</Link>.
        </p>
      </div>
    )
  }
})))

export default Login
