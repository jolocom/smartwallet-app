import React from 'react'
import Radium from 'radium'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton, IconButton} from 'material-ui'
import {proxy} from 'settings'
import AppBar from 'material-ui/AppBar'
import {Link} from 'react-router'

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

  componentDidMount() {
    alert('WHY?')
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
    let {muiTheme} = this.context
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
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left'
      },
      backButton: {
        float: 'left',
        width: '50px',
        paddingTop: '8px'
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
        <AppBar
          title="Forgot password"
          style={{boxShadow: 'none'}}
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName="material-icons">
              arrow_back
          </IconButton>}
          />
        <div style={styles.content}>
          <Formsy.Form
            onValid={this.enableSubmit}
            onInvalid={this.disableSubmit}
            onValidSubmit={this.forgotPassword}
          >
            <div style={{marginBottom: '20px'}}>
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
        <p style={styles.help}>Don't have an account yet?&nbsp;
          <Link to="/signup" style={styles.link}>Sign up</Link>.
        </p>
      </div>
    )
  }
})

export default Radium(ForgotPassword)
