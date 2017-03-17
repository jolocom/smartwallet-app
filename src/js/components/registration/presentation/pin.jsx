import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import Theme from '../../../styles/jolocom-theme'
import PinInput from './pin-input'

const STYLES = {
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '50px',
    backgroundColor: Theme.jolocom.gray4
  },
  header: {
    marginTop: '50px',
    marginBottom: '30px',
    color: '#A4A4A4'
  },
  input: {
    display: 'inline-block'
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
    <div style={STYLES.header}>Create a PIN for secure login</div>
    <PinInput
      value={props.value}
      focused={props.focused}
      disabled={props.confirm}
      onChange={props.onChange}
      onFocusChange={props.onFocusChange} />
    {props.confirm && <div onClick={props.onChangeRequest}>
      Change secure PIN
    </div>}
    {props.confirm && <div>
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
