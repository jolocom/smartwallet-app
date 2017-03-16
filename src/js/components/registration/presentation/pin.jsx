import React from 'react'
import Radium from 'radium'
import Theme from '../../../styles/jolocom-theme'
import PinInput from './pin-input'

const STYLES = {
  root: {
    backgrondColor: Theme.jolocom.gray1
  }
}

const Pin = (props) => {
  return <div style={STYLES.root}>
    <h1>Create a PIN for secure login</h1>
    <PinInput
      value={props.value}
      disabled={props.confirm}
      onChange={props.onChange} />
    {props.confirm && <div onClick={props.onChangeRequest}>
      Change secure PIN
    </div>}
    {props.confirm && <div>
      This secure PIN will be needed for transactions and
      saving information on the Blockchain.
    </div>}
    <div onClick={props.onSubmit}>
      {!props.valid && 'Almost done'}
      {props.valid && !props.confirm && 'Done'}
      {props.valid && props.confirm && 'All right'}
    </div>
  </div>
}
Pin.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  confirm: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onChangeRequest: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Pin)
