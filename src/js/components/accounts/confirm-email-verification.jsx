import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import AccountActions from 'actions/account'
import AccountStore from 'stores/account'

let ConfirmEmailVerification = React.createClass({

  mixins: [Reflux.listenTo(AccountStore, 'onStateUpdate', 'setInitialState')],

  contextTypes: {
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
        margin: '0 auto 20px auto',
        boxSizing: 'border-box'
      },
      button: {
        width: '100%'
      }
    }
    return styles
  },

  setInitialState(initState) {
    this.setState(initState)
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
          <h3>Click the button below to activate your Web ID!</h3>
          <RaisedButton
            type="submit" secondary
            disabled={this.state.disabledSubmit}
            style={styles.button}
            label="CONFIRM ACTIVATION"
            onClick={this.activateEmailAccount}
          />
        </div>
      </div>
    )
  }

})

export default Radium(ConfirmEmailVerification)
