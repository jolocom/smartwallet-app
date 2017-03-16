import React from 'react'
import Radium from 'radium'

const Identifier = (props) => {
  return <div>
    <h1>Please enter e-mail</h1>
    <input
      type="text"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Identifier.propTypes = {
  value: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default Radium(Identifier)
