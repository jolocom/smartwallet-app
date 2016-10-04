import React from 'react'
import Radium from 'radium'
import {RaisedButton, TextField} from 'material-ui'
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
      password: ''
    }
  },

  componentWillMount() {
    const {account} = this.context
    if (account && account.webId) {
      this.context.router.push('/graph')
    }
  },

  login(e) {
    Account.login(this.state.username, this.state.password)
    e.preventDefault()
  },

  _handleUsernameChange(e) {
    this.setState({
      username: e.target.value.toLowerCase()
    })
  },

  _handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
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
        fontSize: '2.5em'
      },
      content: {
        width: '300px',
        maxWidth: '90%',
        padding: '20px',
        margin: '0 auto 20px auto',
        boxSizing: 'border-box'
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
        <div style={styles.logo}>
          <img src="/img/logo.png" style={styles.logoImg} /> Jolocom</div>
        <form style={styles.content} onSubmit={this.login}>
          <div style={{marginBottom: '20px'}}>
            <div>
              <TextField
                floatingLabelText="Username"
                value={this.state.username}
                type="text"
                autocorrect="off"
                autocapitalize="none"
                autocomplete="none"
                onChange={this._handleUsernameChange} />
              <TextField
                floatingLabelText="Password"
                type="password"
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
