import React from 'react'
import Radium from 'radium'

const Pin = (props) => {
  return <div>
    <h1>Name entry</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Pin.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Pin)
