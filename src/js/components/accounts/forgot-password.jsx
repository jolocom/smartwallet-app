import React from 'react'
import Radium from 'radium'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton, IconButton} from 'material-ui'
import {proxy} from 'settings'

import SnackbarActions from 'actions/snackbar'

let ForgotPassword = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  _handleUsernameChange(e) {
    this.setState({
      username: e.target.value.toLowerCase()
    })
  },

  enableSubmit() {
    this.setState({disabledSubmit: false})
  },

  disableSubmit() {
    this.setState({disabledSubmit: true})
  },

  forgotPassword() {
    let user = encodeURIComponent(this.state.username)

    fetch(`${proxy}/forgotpassword`, {
      method: 'POST',
      body: `username=${user}`,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      SnackbarActions
        .showMessage('An email was sent to you with further instructions.')
    }).catch((e) => {
      SnackbarActions.showMessage('An error occured : ' + e)
      // console.error(e)
    })
  },

  goBack() {
    this.context.router.push('/')
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f1f1f1',
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
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left',
        width: '300px',
        maxWidth: '90%',
        padding: '20px 20px 20px 0px',
        margin: '0 auto 20px auto',
        boxSizing: 'border-box',
        float: 'left'
      },
      backButton: {
        float: 'left',
        width: '50px',
        paddingTop: '8px'
      },
      button: {
        width: '100%'
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
            onValidSubmit={this.forgotPassword}
          >
            <div style={{marginBottom: '20px'}}>
              <div style={{width: '350px'}}>
                <div style={styles.backButton}>
                  <IconButton
                    onClick={this.goBack}
                    iconClassName="material-icons">
                    arrow_back
                  </IconButton>
                </div>
                <div style={styles.title}>Forgot password</div>
              </div>
              <FormsyText name="username"
                floatingLabelText="Username"
                autocorrect="off"
                autocapitalize="none"
                autocomplete="none"
                validations="isAlphanumeric"
                validationError="Please only use letters and numbers"
                inputStyle={{textTransform: 'lowercase'}}
                onChange={this._handleUsernameChange}
              />
            </div>

            <RaisedButton type="submit" secondary
              disabled={this.state.disabledSubmit}
              style={styles.button}
              label="REQUEST PASSWORD" />
          </Formsy.Form>
        </div>
      </div>
    )
  }
})

export default Radium(ForgotPassword)
