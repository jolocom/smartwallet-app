import React from 'react'
import Radium from 'radium'

const UserType = (props) => {
  return <div>
    <h1>User type</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
UserType.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(UserType)
