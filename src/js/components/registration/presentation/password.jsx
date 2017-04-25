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
    maxWidth: '360px'
  },
  strengthBar: {
    marginRight: '30px',
    marginLeft: '30px'
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
    textAlign: 'left'
  }
}

const strengthBarColor = (strength) => {
  switch (strength) {
    case 'strong':
      return 'green'
    case 'good':
      return 'yellow'
    default:
      return 'red'
  }
}

const showBar = (value, strength, barIndex) => {
  if (strength === 'strong') {
    return 'visible'
  }
  if (value && barIndex === 'firstBar') {
    return 'visible'
  }
  if (strength !== 'weak' && barIndex === 'secondBar') {
    return 'visible'
  }
  return 'hidden'
}

function StrengthBar(props) {
  return <div style={STYLES.strengthBar}>
    <svg width="100%" height="4">
      <line
        x1="0%"
        y1="2"
        x2="30%"
        y2="2"
        visibility={showBar(props.value, props.strength, 'firstBar')}
        strokeWidth="4"
        stroke={strengthBarColor(props.strength)}
      />
      <line
        x1="33%"
        y1="2"
        x2="67%"
        y2="2"
        visibility={showBar(props.value, props.strength, 'secondBar')}
        strokeWidth="4"
        stroke={strengthBarColor(props.strength)}
      />
      <line
        x1="70%"
        y1="2"
        x2="100%"
        y2="2"
        visibility={showBar(props.value, props.strength, 'thirdBar')}
        strokeWidth="4"
        stroke={strengthBarColor(props.strength)}
      />
    </svg>
  </div>
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
          <PasswordField
            style={STYLES.password}
            floatingLabelText="Password"
            hintText={props.strength + ' password'}
            value={props.value}
            onChange={
              e => props.onChangePassword(e.target.value)
            }
            errorText={props.passwordStrengthErrorMessage}
          />
          <StrengthBar strength={props.strength} value={props.value} />
          <PasswordField
            style={STYLES.password}
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
            <th>For more security please use at least :</th>
            <tr>- one Number</tr>
            <tr>- one Upper Case (e.g. A,B,C...)</tr>
            <tr>- one Lower Case (e.g. a,b,c...)</tr>
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
