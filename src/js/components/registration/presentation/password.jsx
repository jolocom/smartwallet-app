import React from 'react'
import Radium from 'radium'
import PasswordField from 'material-ui-password-field'
import {theme} from 'styles'
import {RaisedButton} from 'material-ui'

import {Container, Header, Content, Block, Footer} from '../../structure'

const STYLES = {
  password: {
    margin: '0px 30px 10px 30px',
    backgroundColor: '#ffffff'
  },
  passwordsContainer: {
    backgroundColor: '#ffffff',
    maxWidth: '360px',
    position: 'relative'
  },
  strengthBarBlock: {
    position: 'relative'
  },
  strengthBar: {
    marginRight: '30px',
    marginLeft: '30px',
    position: 'absolute',
    top: 62,
    left: 0
  },
  explanation: [{
    marginTop: '20px',
    color: theme.jolocom.gray1
  }, {
    marginTop: '20px',
    color: theme.jolocom.gray1,
    visibility: 'hidden'
  }],
  button: {
    display: 'inline-block',
    marginTop: '30px'
  },
  helpMsg: {
    textAlign: 'left',
    fontSize: '13px',
    marginLeft: '18px'
  },
  errorStyle: {
    paddingTop: '10px',
    textAlign: 'left',
    paddingRigth: '0',
    marginRigth: '0'
  },
  underlineDisabled: {
    borderBottom: '0.2px solid'
  }
}

const strengthBarColor = (value, strength, barIndex) => {
  if (value) {
    if (strength === 'strong') {
      return theme.palette.primary1Color
    }
    if (strength === 'weak' && barIndex === 'firstBar') {
      return '#e8540c'
    }
    if (strength === 'good' && barIndex !== 'thirdBar') {
      return '#fdbc38'
    } else {
      return 'lightgray'
    }
  } else {
    return 'lightgray'
  }
}

function StrengthBar(props) {
  return (<div style={STYLES.strengthBar}>
    <svg width="100%" height="4">
      <line
        x1="0%"
        y1="2"
        x2="30%"
        y2="2"
        strokeWidth="4"
        stroke={strengthBarColor(props.value, props.strength, 'firstBar')}
      />
      <line
        x1="33%"
        y1="2"
        x2="67%"
        y2="2"
        strokeWidth="4"
        stroke={strengthBarColor(props.value, props.strength, 'secondBar')}
      />
      <line
        x1="70%"
        y1="2"
        x2="100%"
        y2="2"
        strokeWidth="4"
        stroke={strengthBarColor(props.value, props.strength, 'thirdBar')}
      />
    </svg>
  </div>)
}

StrengthBar.propTypes = {
  strength: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
}

function Password(props) {
  return (
    <Container>
      <Header title="... and a password" />
      <Content>
        <Block style={STYLES.passwordsContainer}>
          <Block style={STYLES.strengthBarBlock}>
            <PasswordField
              style={STYLES.password}
              floatingLabelText="Password"
              hintText={props.strength + ' password'}
              value={props.value}
              onChange={
                e => props.onChangePassword(e.target.value)
              }
              errorText={props.passwordStrengthErrorMessage}
              errorStyle={STYLES.errorStyle}
            />
            <StrengthBar
              strength={props.strength} value={props.value} />
          </Block>
          <PasswordField
            style={STYLES.password}
            underlineDisabledStyle={STYLES.underlineDisabled}
            floatingLabelText="Repeat Password"
            disabled={props.repeatedValueState}
            value={props.repeatedValue}
            onChange={
              e => props.onChangeRepeatedPassword(e.target.value)
            }
            errorText={props.passwordsMatchErrorMessage}
          />
        </Block>
        <Block
          style={STYLES.explanation[props.repeatedValueState ? 0 : 1]}
        >
          <table style={STYLES.helpMsg}>
            <tbody>
              <tr><td>For more security please use at least :</td></tr>
              <tr><td>- one Number</td></tr>
              <tr><td>- one Upper Case (e.g. A,B,C...)</td></tr>
              <tr><td>- one Lower Case (e.g. a,b,c...)</td></tr>
            </tbody>
          </table>
        </Block>
      </Content>
      <Footer>
        <RaisedButton
          disabled={!props.valid}
          secondary={props.valid}
          label="NEXT STEP"
          onClick={props.onSubmit}
        />
      </Footer>
    </Container>
  )
}

Password.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeRepeatedPassword: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  repeatedValue: React.PropTypes.string.isRequired,
  passwordStrengthErrorMessage: React.PropTypes.string.isRequired,
  passwordsMatchErrorMessage: React.PropTypes.string.isRequired,
  hasDigit: React.PropTypes.bool.isRequired,
  hasLowerCase: React.PropTypes.bool.isRequired,
  hasUpperCase: React.PropTypes.bool.isRequired,
  repeatedValueState: React.PropTypes.bool.isRequired,
  strength: React.PropTypes.string.isRequired
}

export default Radium(Password)
