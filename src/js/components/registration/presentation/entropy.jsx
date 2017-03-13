import React from 'react'
import Radium from 'radium'

const Entropy = (props) => {
  return <div
    style={{ width: '400px', height: '400px', backgroundColor: '#EEE' }}
    onMouseMove={(e) => props.onMouseMovement(e.clientX, e.clientY)}
  >
    <h1>Entropy</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Entropy.propTypes = {
  onMouseMovement: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Entropy)
