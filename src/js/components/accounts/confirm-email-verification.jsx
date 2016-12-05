import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import {proxy} from 'settings'
import SnackbarActions from 'actions/snackbar'

let ConfirmEmailVerification = React.createClass({

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

  activateEmailAccount() {
    let user = encodeURIComponent(this.props.params.username)
    let code = encodeURIComponent(this.props.params.code)

    fetch(`${proxy}/verifyemail`, {
      method: 'POST',
      body: `username=${user}&code=${code}`,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      SnackbarActions
        .showMessage('Your account has been activated!')
      this.redirectToLogin()
    }).catch((e) => {
      SnackbarActions.showMessage('An error occured : ' + e)
      // console.error(e)
    })
  },

  redirectToLogin() {
    this.context.router.push('/')
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
