import React from 'react'
import Radium from 'radium'
import {RaisedButton, TextField} from 'material-ui'
import {History, Link} from 'react-router'

import Account from 'actions/account'

// login for development
let Login = React.createClass({
  mixins: [
    History
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object,
    username: React.PropTypes.string
  },

  getInitialState() {
    return {
      username: '',
      password: ''
    }
  },
  componentWillMount() {
    if (this.context.username) {
      // this.history.pushState(null, '/')
    }
  },
  componentDidUpdate() {
    if (this.context.username) {
      // this.history.pushState(null, '/')
    }
  },

  login() {
    Account.login(this.state.username, this.state.password)
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
    return (
      <div style={styles.container}>
        <div style={styles.logo}><img src="/img/logo.png" style={styles.logoImg}/> Jolocom</div>
        <form style={styles.content} onSubmit={this.login}>
          <div style={{marginBottom: '20px'}}>
            <div>
              <TextField floatingLabelText="Username" onChange={this._handleUsernameChange} />
              <TextField floatingLabelText="Password" type="password" onChange={this._handlePasswordChange} />
            </div>
          </div>
          <RaisedButton type="submit" secondary={true} style={styles.button} label="Login"/>
        </form>
        <p style={styles.help}>Don't have an account yet? <Link to="/signup" style={styles.link}>Sign up</Link>.</p>
      </div>
    )
  }
})

export default Radium(Login)
