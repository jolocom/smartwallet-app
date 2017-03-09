import React from 'react'
import Radium from 'radium'

const NameEntry = (props) => {
  return <div>
    <h1>Name entry</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
NameEntry.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
