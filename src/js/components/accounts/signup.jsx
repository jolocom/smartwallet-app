import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton, IconButton, AppBar} from 'material-ui'
import {Link} from 'react-router'

import SnackbarActions from 'actions/snackbar'

import AvailabilityStore from 'stores/availability'

import Account from 'actions/account'
import AccountStore from 'stores/account'

import Utils from 'lib/util'

let Signup = React.createClass({
  mixins: [
    Reflux.connect(AvailabilityStore, 'available'),
    Reflux.connect(AccountStore, 'account')
  ],

  contextTypes: {
    muiTheme: React.PropTypes.object,
    account: React.PropTypes.object,
    router: React.PropTypes.object
  },

  errorMessages: {
    alphaNumeric: 'Please only use letters and numbers',
    email: 'Please provide a valid email',
    name: 'Please enter a valid name',
    password: 'Please enter a password',
    unavailable: 'This username is already taken'
  },

  helperMessages: {
    userName: 'This is your unique identifier',
    givenName: 'This will be shown in your profile node'
  },

  getInitialState() {
    return {
      disabledSubmit: true,
      showHelperTextUserName: false,
      showHelperTextGivenName: false
    }
  },

  componentWillMount() {
    const {account} = this.context
    if (account && account.webId) {
      this.context.router.push('/graph')
    }
  },

  signup() {
    if (this.state.email !== this.state.email2) {
      SnackbarActions.showMessage('The two emails do not match.')
      return
    }
    let signupData = {
      username: this.state.username,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    Account.signup(signupData)
  },

  componentDidUpdate() {
    if (this.state.account && this.state.account.username) {
      // this.emailVerifyScreen() // TODO: test when server is working
      this.context.router.push('/graph')
    }
  },

  enableSubmit() {
    this.setState({disabledSubmit: false})
  },

  disableSubmit() {
    this.setState({disabledSubmit: true})
  },

  goBack() {
    this.context.router.push('/')
  },

  _onUsernameChange(e) {
    this.setState({
      username: e.target.value.toLowerCase()
    })
    // Availability.check(e.target.value.toLowerCase())
  },

  _onNameChange(e) {
    this.setState({
      name: e.target.value
    })
  },

  _onEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  },

  _onEmail2Change(e) {
    this.setState({
      email2: e.target.value
    })
  },

  _onPasswordChange(e) {
    this.setState({
      password: e.target.value
    })
    // Sign up button is re-enabled once all required fields are non-empty
    if ((this.state.username !== '') && (this.state.email !== '') &&
      (this.state.email2 !== '')) {
      this.setState({
        disabledSubmit: false
      })
    }
  },

  _handleHelperTextUserNameFocus() {
    this.setState({
      showHelperTextUserName: true
    })
  },

  _handleHelperTextGivenNameFocus() {
    this.setState({
      showHelperTextGivenName: true
    })
  },

  _handleHelperTextUserNameBlur() {
    this.setState({
      showHelperTextUserName: false
    })
  },

  _handleHelperTextGivenNameBlur() {
    this.setState({
      showHelperTextGivenName: false
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
        textTransform: 'uppercase'
      },
      logoImg: {
        maxWidth: '80%',
        width: '256px'
      },
      title: {
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left'
      },
      content: {
        width: '300px',
        maxWidth: '90%',
        padding: '0px 20px 20px',
        margin: '10px auto 20px auto',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff'
      },
      contentEmailVerify: {
        width: '360px',
        maxWidth: '90%',
        padding: '0px 5px 5px',
        margin: '10px auto 20px auto',
        boxSizing: 'border-box'
      },
      safariCookieWarning: {
        fontWeight: 'bold',
        padding: '0 20px',
        marginBottom: '1em'
      },
      button: {
        width: '100%'
      },
      help: {
        color: muiTheme.jolocom.gray1,
        marginBottom: '10px'
      },
      link: {
        color: muiTheme.palette.accent1Color,
        fontWeight: 'bold'
      },
      helperText: {
        color: muiTheme.jolocom.gray2,
        fontSize: '12px',
        textAlign: 'left'
      },
      requiredMsg: {
        textAlign: 'left',
        color: muiTheme.jolocom.gray2,
        fontSize: '12px',
        marginTop: '20px'
      },
      signUpMessage: {
        textAlign: 'center',
        color: muiTheme.jolocom.gray1,
        fontSize: '12pt',
        marginTop: '30px',
        fontWeight: '100',
        lineHeight: '14pt'
      }
    }

    return styles
  },

  // What is the purpose of this function?
  // handleClick() {
  //   Account.signup()
  // },

  render() {
    let styles = this.getStyles()
    let cookieWarning

    if (Utils.isSafari()) {
      cookieWarning = (
        <p style={styles.safariCookieWarning}>
          {`In order for the application to work with Safari,
            please go to the privacy settings of your browser
            and choose "Allow cookies for all websites".
          `}
        </p>
      )
    }

    return (
      <div style={styles.container}>
        <AppBar
          title="Sign up"
          style={{boxShadow: 'none'}}
          titleStyle={styles.title}
          iconElementLeft={<IconButton onClick={this.goBack}
            iconClassName="material-icons">
              arrow_back
          </IconButton>}
          />
        <div style={styles.logo}>
          <img src="/img/logo_littlesister.svg" style={styles.logoImg} />
        </div>
        {AccountStore.state.emailVerifyScreen
          ? <div style={styles.contentEmailVerify}>
            <p style={styles.signUpMessage}>
              Thank you for signing up to Little Sister!<br />
              Please check your email. We've sent you a message
               with a confirmation link.
            </p>
          </div>
          : <div>
            <div style={styles.content}>
              <Formsy.Form
                onValid={this.enableSubmit}
                onInvalid={this.disableSubmit}
                onValidSubmit={this.signup}
                >
                <div style={{marginBottom: '20px'}}>
                  <FormsyText
                    name="username"
                    autocorrect="off"
                    autocapitalize="none"
                    autocomplete="none"
                    floatingLabelText="Username*"
                    validations="isAlphanumeric"
                    validationError={this.errorMessages.alphaNumeric}
                    inputStyle={{textTransform: 'lowercase'}}
                    onChange={this._onUsernameChange}
                    onFocus={this._handleHelperTextUserNameFocus}
                    onBlur={this._handleHelperTextUserNameBlur}
                    required
                    />
                  <div>
                    <p style={styles.helperText}>
                      {this.state.showHelperTextUserName
                        ? this.helperMessages.userName : null}
                    </p>
                  </div>
                  <FormsyText
                    name="name"
                    floatingLabelText="Full name"
                    validations="isWords"
                    validationError={this.errorMessages.name}
                    onChange={this._onNameChange}
                    onFocus={this._handleHelperTextGivenNameFocus}
                    onBlur={this._handleHelperTextGivenNameBlur}
                    />
                  <div>
                    <p style={styles.helperText}>
                    {this.state.showHelperTextGivenName
                      ? this.helperMessages.givenName : null}
                    </p>
                  </div>
                  <FormsyText
                    name="email"
                    floatingLabelText="Email*"
                    validations="isEmail"
                    validationError={this.errorMessages.email}
                    onChange={this._onEmailChange}
                    required
                    />
                  <FormsyText
                    name="email"
                    floatingLabelText="Repeat Email*"
                    validations="isEmail"
                    validationError={this.errorMessages.email}
                    onChange={this._onEmail2Change}
                    required
                    />
                  <FormsyText
                    name="password"
                    type="password"
                    floatingLabelText="Password*"
                    onChange={this._onPasswordChange}
                    required
                    />
                </div>

                <RaisedButton
                  type="submit"
                  secondary
                  disabled={this.state.disabledSubmit}
                  style={styles.button} label="Sign up"
                />
              </Formsy.Form>
              <p style={styles.requiredMsg}>
                * indicates required field
              </p>
            </div>
            {cookieWarning}
            <p style={styles.help}>
              Already have an account?&nbsp;
              <Link to="/login" style={styles.link}>Login instead</Link>.
            </p>
          </div>}
      </div>
    )
  }
})

export default Radium(Signup)
