import React from 'react'
import Radium from 'radium'
import {RaisedButton, TextField, Paper} from 'material-ui'
import {History, Link} from 'react-router'

import Account from 'actions/account'
import AccountStore from 'stores/account'

// login for development
let Login = React.createClass({
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
      <div style={styles.container}>
        <header style={styles.header}>
          <img src="/img/logo.png" style={styles.logo} />
        </header>
        <Paper zDept={2} style={styles.content}>
          <div>
            <TextField floatingLabelText="Username" onChange={this._handleUsernameChange} />
          </div>
          <RaisedButton secondary={true} onTouchTap={this.login} style={styles.button}>Login</RaisedButton>
        </Paper>
        <p>Don't have an account yet? <Link to="/signup">Sign up</Link>.</p>
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
    fontSize: '2.5em'
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

export default Radium(Login)
