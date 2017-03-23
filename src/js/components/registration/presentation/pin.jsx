import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import Theme from '../../../styles/jolocom-theme'
import PinInput from './pin-input'
import RegistrationStyles from '../styles'

const STYLES = {
  root: RegistrationStyles.container,
  header: {
    marginTop: '50px',
    marginBottom: '30px',
    color: Theme.jolocom.gray1
  },
  input: {
    display: 'inline-block'
  },
  changeLink: {
    margin: '20px 0',
    color: Theme.palette.accent1Color,
    textTransform: 'uppercase'
  },
  explanation: {
    marginTop: '140px',
    color: Theme.jolocom.gray1
  },
  button: {
    display: 'inline-block',
    marginTop: '30px'
  }
}

function getButtonLabel(props) {
  if (!props.valid) {
    return 'Almost done'
  }
  if (props.confirm) {
    return 'All right'
  } else {
    return 'Done'
  }
}

const Pin = (props) => {
  return <div style={STYLES.root}>
    <div style={{...RegistrationStyles.header,
      ...RegistrationStyles.elementSpacing}}>
      {props.confirm || 'Create a PIN for secure login.'}
      {props.confirm && 'Your Secure PIN.'}
    </div>
    <PinInput
      value={props.value}
      focused={props.focused}
      disabled={props.confirm}
      onChange={props.onChange}
      onFocusChange={props.onFocusChange}
      confirm={props.confirm} />
    {props.confirm && <div
      style={STYLES.changeLink}
      onClick={props.onChangeRequest}
    >
      Change secure PIN
    </div>}
    {props.confirm && <div style={STYLES.explanation}>
      This secure PIN will be needed for transactions and
      saving information on the Blockchain.
    </div>}

    <div style={STYLES.button}>
      <RaisedButton
        disabled={!props.valid}
        secondary={props.valid}
        label={getButtonLabel(props)}
        onClick={props.onSubmit}
      />
    </div>
  </div>
}
Pin.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  focused: React.PropTypes.bool.isRequired,
  confirm: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onChangeRequest: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onFocusChange: React.PropTypes.func.isRequired
}

export default Radium(Pin)
