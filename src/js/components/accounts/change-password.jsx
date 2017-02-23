import React from 'react'
import { connect } from 'redux/utils'
import Radium from 'radium'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton} from 'material-ui'

let ChangePassword = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.string.isRequired,
    showSnackBarMessage: React.PropTypes.func.isRequired,
    doResetPassword: React.PropTypes.func.isRequired
  },

  enableSubmit() {
    this.setState({disabledSubmit: false})
  },

  disableSubmit() {
    this.setState({disabledSubmit: true})
  },

  showValidationError() {
    this.props.showSnackBarMessage('The two passwords do not match.')
  },

  changePassword({password}) {
    const {username, token} = this.props.params
    this.props.doResetPassword(
      {username, token, password}
    )
  },

  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f8f9fb',
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
            onInvalidSubmit={this.showValidationError}
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
                // onChange={this._handlePasswordChange}
              />
              <FormsyText
                name="repeatPassword"
                type="password"
                floatingLabelText="Repeat password"
                validations="equalsField:password"
                // onChange={this._handlePasswordRepeatedChange}
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

export default connect({
  actions: ['snack-bar:showSnackBarMessage', 'account:doResetPassword']
})(Radium(ChangePassword))

