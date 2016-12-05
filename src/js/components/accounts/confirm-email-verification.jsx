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
    container: {

    },
    title: {

    },
    message: {

    }
  },

  activateEmailAccount() {
    fetch(`${proxy}/verifyemail`, {
      method: 'POST',
      body: `username=${user}, code=${code}`,
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
      this.redirectToLogin
    }).catch((e) => {
      SnackbarActions.showMessage('An error occured : ' + e)
      // console.error(e)
    })
  },

  redirectToLogin() {
    this.context.router.push('/')
  }

})

export default Radium(ConfirmEmailVerification)
