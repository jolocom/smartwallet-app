import React from 'react'
import Radium from 'radium'
import PinInput from './pin-input'

const Pin = (props) => {
  return <div>
    <h1>Pin entry</h1>
    <PinInput value={props.value} onChange={props.onChange} />
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Pin.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Pin)
