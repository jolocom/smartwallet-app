import React from 'react'
import Radium from 'radium'
import { connect } from 'redux_state/utils'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import {RaisedButton, IconButton} from 'material-ui'
import AppBar from 'material-ui/AppBar'
import {Link} from 'react-router'

import {Container} from '../structure'

let ForgotPassword = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
  },

  propTypes: {
    doForgotPassword: React.PropTypes.func.isRequired
  },

  enableSubmit() {
    this.setState({disabledSubmit: false})
  },

  disableSubmit() {
    this.setState({disabledSubmit: true})
  },

  forgotPassword({username}) {
    this.props.doForgotPassword({username})
  },

  goBack() {
    this.context.router.push('/')
  },

  getStyles() {
    let {muiTheme} = this.context
    let styles = {
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
      <Container>
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
              <FormsyText
                name="username"
                floatingLabelText="Username"
                autoCorrect="off"
                autoCapitalize="none"
                autoComplete="none"
                validations="isAlphanumeric"
                validationError="Please only use letters and numbers"
                inputStyle={{textTransform: 'lowercase'}}
              />
            </div>

            <RaisedButton
              type="submit"
              secondary
              disabled={this.state.disabledSubmit}
              style={styles.button}
              label="REQUEST PASSWORD" />
          </Formsy.Form>
        </div>
        <p style={styles.help}>Don't have an account yet?&nbsp;
          <Link to="/signup" style={styles.link}>Sign up</Link>.
        </p>
      </Container>
    )
  }
})

export default connect({
  actions: ['snack-bar:showSnackBarMessage', 'account:doForgotPassword']
})(Radium(ForgotPassword))
