import React from 'react'
import Radium from 'radium'

const Password = (props) => {
  return <div>
    <h1>Enter a password</h1>
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}
Password.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Password)
