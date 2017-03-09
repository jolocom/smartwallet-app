import React from 'react'
import Radium from 'radium'

const Identifier = (props) => {
  return <div>
    <h1>Please enter e-mail</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Identifier.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Identifier)
