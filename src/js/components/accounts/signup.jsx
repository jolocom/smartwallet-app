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
      showHelperTextGivenName: false,
      emailVerifyScreen: false
    }
  },

  componentWillMount() {
    const {account} = this.context
    if (account && account.webId) {
      this.context.router.push('/graph')
    }
  },

  signup(model) {
    if (model.email !== model.repeatEmail) {
      SnackbarActions.showMessage('The two emails do not match.')
      return
    }

    this.disableSubmit()

    let signupData = {
      username: model.username,
      name: model.name,
      email: model.email,
      password: model.password
    }

    Account.signup(signupData)
  },

  componentDidUpdate() {
    if (this.state.account && this.state.account.username) {
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
        background: '#f8f9fb',
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
      },
      input: {
        boxShadow: 'none' // Disable required styles in firefox
      },
      username: {
        textTransform: 'lowercase'
      }
    }

    return styles
  },

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
        {this.state.account.emailVerifyScreen
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
                autoComplete="off"
                >
                <div style={{marginBottom: '20px'}}>
                  <FormsyText
                    name="username"
                    autoCorrect="off"
                    autoCapitalize="none"
                    autoComplete="none"
                    floatingLabelText="Username*"
                    validations="isAlphanumeric"
                    validationError={this.errorMessages.alphaNumeric}
                    inputStyle={
                      Object.assign({}, styles.input, styles.username)
                    }
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
                    inputStyle={styles.input}
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
                    type="email"
                    autoComplete="off"
                    floatingLabelText="Email*"
                    validations="isEmail"
                    validationError={this.errorMessages.email}
                    inputStyle={styles.input}
                    required
                    />
                  <FormsyText
                    name="repeatEmail"
                    type="email"
                    autoComplete="off"
                    floatingLabelText="Repeat Email*"
                    validations="isEmail"
                    validationError={this.errorMessages.email}
                    inputStyle={styles.input}
                    required
                    />
                  <FormsyText
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    floatingLabelText="Password*"
                    inputStyle={styles.input}
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
