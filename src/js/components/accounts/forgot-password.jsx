import React from 'react'
import ReactDom from 'react-dom'
import Reflux from 'reflux'
import Radium from 'radium'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton, IconButton} from 'material-ui'

import {Link} from 'react-router'

import Account from 'actions/account'
import AccountStore from 'stores/account'

let ForgotPassword = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  errorMessage: {
    email: 'Please provide a valid email'
  },

  forgotPassword(){
    alert('you sir, have forgot your password.')
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
        fontWeight: 'normal',
        fontSize: '20px',
        color: '#4B142B',
        textAlign: 'left',
        width: '300px',
        maxWidth: '90%',
        padding: '20px',
        margin: '0 auto 20px auto',
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
        margin: '0 auto 0px auto',
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
            <div>
              <div style={styles.backButton}>
                <IconButton
                  onClick={this.goBack}
                  iconClassName="material-icons">
                  arrow_back</IconButton>
              </div>
              <div style={styles.title}>Forgot password</div>
            </div>
            <FormsyText name="email"
                        floatingLabelText="Email"
                        validations="isEmail"
                        validationError={this.errorMessage.email}
                        onChange={this._onEmailChange}
            />
          </div>

          <RaisedButton type="submit" secondary={true}
                        disabled={this.state.disabledSubmit}
                        style={styles.button}
                        label="REQUEST PASSWORD"/>
        </Formsy.Form>
      </div>
    </div>
    )
  }
})

export default Radium(ForgotPassword)
