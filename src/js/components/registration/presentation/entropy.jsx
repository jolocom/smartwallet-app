import React from 'react'
import Radium from 'radium'

const Entropy = (props) => {
  return <div>
    <h1>Entropy</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Entropy.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Entropy)
