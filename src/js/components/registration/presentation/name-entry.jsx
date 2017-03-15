import React from 'react'
import Radium from 'radium'

const NameEntry = (props) => {
  return <div>
    <h1>Name entry</h1>
    <input type="text"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
