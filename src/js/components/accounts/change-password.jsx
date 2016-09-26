import React from 'react'
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
    params: React.PropTypes.string.isRequired
  },

  errorMessage: {
    email: 'Please provide a valid email'
  },

  forgotPassword() {
    alert('you sir, have forgot your password.')
  },

  enableSubmit() {
    this.setState({disabledSubmit: false})
  },

  disableSubmit() {
    this.setState({disabledSubmit: true})
  },

  changePassword() {
  },
  getStyles() {
    let styles = {
      container: {
        textAlign: 'center',
        background: '#f1f1f1',
        height: '100%',
        overflowY: 'auto',
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
            onValidSubmit={this.forgotPassword}
          >
            <h3 style={styles.username}>{this.props.params.username}</h3>
            <div style={{marginBottom: '20px'}}>
              <div style={{width: '400px'}}>
                <div style={styles.title}>Change password</div>
              </div>
              <FormsyText
                name="password"
                type="password"
                floatingLabelText="New password"
              />
              <FormsyText
                name="password"
                type="password"
                floatingLabelText="Repeat password"
                onChange={this._onPasswordChange}
              />
            </div>
            <RaisedButton
              type="submit" secondary
              disabled={this.state.disabledSubmit}
              style={styles.button}
              label="LOG IN"
              onClick={this.changePassword} />
          </Formsy.Form>
        </div>
      </div>
    )
  }
})

export default Radium(ChangePassword)
