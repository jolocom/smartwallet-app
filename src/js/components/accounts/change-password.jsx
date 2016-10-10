import React from 'react'
import Radium from 'radium'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton} from 'material-ui'
import {proxy} from 'settings'

import SnackbarActions from 'actions/snackbar'

let ChangePassword = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.string.isRequired
  },

  errorMessage: {
    email: 'Please provide a valid email'
  },

  enableSubmit() {
    this.setState({disabledSubmit: false})
  },

  disableSubmit() {
    this.setState({disabledSubmit: true})
  },

  _handlePasswordChange(e) {
    this.setState({
      newPassword: e.target.value.toLowerCase()
    })
  },

  _handlePassword2Change(e) {
    this.setState({
      newPassword2: e.target.value.toLowerCase()
    })
  },

  changePassword() {
    if (this.state.newPassword !== this.state.newPassword2) {
      SnackbarActions.showMessage('The two passwords do not match.')
      return
    }

    let user = encodeURIComponent(this.props.params.username)
    let token = encodeURIComponent(this.props.params.token)
    let newpassword = this.state.newPassword

    fetch(`${proxy}/resetpassword`, {
      method: 'POST',
      body: `username=${user}&code=${token}&password=${newpassword}`,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      SnackbarActions.showMessage('Your password has been reset.')
      this.context.router.push('/login')
    }).catch((e) => {
      SnackbarActions.showMessage('An error occured : ' + e)
      console.error(e)
    })
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f1f1f1',
        height: '100%',
        overflowY: 'auto'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left',
        width: '300px',
        maxWidth: '90%',
        padding: '20px 20px 20px 0px',
        margin: '4px auto',
        boxSizing: 'border-box',
        float: 'left'
      },
      backButton: {
        float: 'left',
        width: '50px',
        paddingTop: '8px'
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
      username: {
        float: 'left',
        margin: '0px',
        position: 'fixed'
      }
    }

    return styles
  },

  render() {
    let styles = this.getStyles()

    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <Formsy.Form
            onValid={this.enableSubmit}
            onInvalid={this.disableSubmit}
            onValidSubmit={this.changePassword}
          >
            <div style={{marginBottom: '20px'}}>
              <div style={{width: '400px'}}>
                <div style={styles.title}>
                  Set new password for {this.props.params.username}
                </div>
              </div>
              <FormsyText
                name="password"
                type="password"
                floatingLabelText="New password"
                onChange={this._handlePasswordChange}
              />
              <FormsyText
                name="password"
                type="password"
                floatingLabelText="Repeat password"
                onChange={this._handlePassword2Change}
              />
            </div>
            <RaisedButton
              type="submit" secondary
              disabled={this.state.disabledSubmit}
              style={styles.button}
              label="CHANGE PASSWORD"
            />
          </Formsy.Form>
        </div>
      </div>
    )
  }
})

export default Radium(ChangePassword)
