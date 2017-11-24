import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'

const LoginForm = (props) => {
  const {
    style,
    username,
    password,
    usernameError,
    passwordError,
    onSubmit,
    onUsernameChange,
    onPasswordChange,
    ...otherProps
  } = props

  return (
    <div />
  )
}

LoginForm.propTypes = {
  style: React.PropTypes.object,
  onSubmit: React.PropTypes.func.isRequired,
  onUsernameChange: React.PropTypes.func,
  onPasswordChange: React.PropTypes.func,
  username: React.PropTypes.string,
  password: React.PropTypes.string,
  usernameError: React.PropTypes.string,
  passwordError: React.PropTypes.string
}

const styles = {
  container: {
    width: '320px',
    maxWidth: '90%',
    padding: '0px 20px 20px',
    margin: '10px auto 20px auto',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff'
  },
  submit: {
    width: '100%'
  },
  forgotPassword: {
    float: 'right',
    padding: '10px',
    color: '#7B8288',
    fontSize: '0.75em'
  }
}

export default Radium(LoginForm)
