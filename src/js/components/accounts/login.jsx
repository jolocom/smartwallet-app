import React from 'react'
import Radium from 'radium'
import {RaisedButton, TextField, IconButton, AppBar} from 'material-ui'
import {Link} from 'react-router'

import Account from 'actions/account'

import Utils from 'lib/util'

// login for development
let Login = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    account: React.PropTypes.object,
    router: React.PropTypes.object
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
    // Handle empty form fields
    if (this.state.username === '') {
      this.setState({
        userErrorMsg: 'Please enter a username'
      })
    } else if (this.state.password === '') {
      this.setState({
        pwErrorMsg: 'Please enter a password'
      })
    }
    Account.login(this.state.username, this.state.password)
    e.preventDefault()
  },

  _handleUsernameChange(e) {
    this.setState({
      userErrorMsg: ''
    })
    this.setState({
      username: e.target.value.toLowerCase()
    })
  },

  _handlePasswordChange(e) {
    this.setState({
      pwErrorMsg: ''
    })
    this.setState({
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
                value={this.state.username}
                type="text"
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="none"
                errorText={this.state.userErrorMsg}
                onChange={this._handleUsernameChange} />
              <TextField
                floatingLabelText="Password"
                type="password"
                errorText={this.state.pwErrorMsg}
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
})

export default Radium(Login)
