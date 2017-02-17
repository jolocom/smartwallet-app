import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import AccountActions from 'actions/account'
import AccountStore from 'stores/account'
import JolocomTheme from 'styles/jolocom-theme'

import getMuiTheme from 'material-ui/styles/getMuiTheme'

const theme = getMuiTheme(JolocomTheme)

let ConfirmEmailVerification = React.createClass({

  mixins: [Reflux.listenTo(AccountStore, 'onStateUpdate', 'setInitialState')],

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object

  },

  propTypes: {
    params: React.PropTypes.string
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f8f9fb',
        height: '100%',
        overflowY: 'auto'
      },
      content: {
        width: '300px',
        maxWidth: '90%',
        padding: '20px',
        margin: '20px auto 20px auto',
        boxSizing: 'border-box'
      },
      confirmMessage: {
        textAlign: 'center',
        fontWeight: '300',
        color: theme.jolocom.gray1,
        fontSize: '18pt',
        marginTop: '30px',
        lineHeight: '14pt',
        marginBottom: '15px'
      },
      username: {
        textAlign: 'center',
        fontWeight: '400',
        color: theme.jolocom.gray1,
        fontSize: '18pt',
        marginTop: '10px',
        lineHeight: '14pt',
        marginBottom: '15px'
      },
      button: {
        marginTop: '30px',
        width: '100%'
      }
    }
    return styles
  },

  setInitialState(initState) {
    this.setState(initState)
    this.activateEmailAccount
  },

  onStateUpdate(newState) {
    this.setState(newState)
  },

  activateEmailAccount() {
    let user = encodeURIComponent(this.props.params.username)
    let code = encodeURIComponent(this.props.params.code)

    AccountActions.activateEmail(user, code)
  },

  componentDidUpdate() {
    if (this.state.emailVerifyCompleted) {
      this.redirectToLogin()
    }
  },

  redirectToLogin() {
    this.context.router.push('/login')
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div>
            <p style={styles.confirmMessage}>Congrats!</p>
          </div>
          <div style={styles.confirmMessage} >
            <p> Your username is</p>
          </div>
          <div style={styles.username}>
            <p> {this.props.params.username}</p>
          </div>

          <RaisedButton
            type="submit" secondary
            disabled={this.state.disabledSubmit}
            style={styles.button}
            label="GET STARTED"
            onClick={this.activateEmailAccount}
          />
        </div>
      </div>
    )
  }

})

export default Radium(ConfirmEmailVerification)
