import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import {History, Link} from 'react-router'

import Availability from 'actions/availability'
import AvailabilityStore from 'stores/availability'

import Account from 'actions/account'
import AccountStore from 'stores/account'

let Signup = React.createClass({
  mixins: [
    History,
    Reflux.connect(AvailabilityStore, 'available'),
    Reflux.connect(AccountStore, 'account')
  ],
  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getInitialState() {
    return {
      disabledSubmit: true
    }
  },

  componentWillMount() {
    if (this.state.account && this.state.account.username)
      this.history.pushState(null, '/graph')
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

  handleClick() {
    Account.signup()
  },

  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <div style={styles.logo}><img src="/img/logo.png" style={styles.logoImg}/> Jolocom</div>
        <div style={styles.content}>
            <RaisedButton type="submit" onTouchTap={this.handleClick} secondary={true}  style={styles.button} label="Sign up"/>
        </div>

        <p style={styles.help}>Already have an account? <Link to="/login" style={styles.link}>login instead</Link>.</p>
      </div>
    )
  }
})

export default Radium(Signup)
