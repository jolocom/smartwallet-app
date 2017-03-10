import React from 'react'
import Radium from 'radium'

const Password = (props) => {
  return <div>
    <h1>Enter your password</h1>
    <input type="password" />
    <h1>Repeat Password</h1>
    <input type="password" />
    <div onClick={props.onSubmit}>Next!</div>
  </div>
}

Password.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(Password)
