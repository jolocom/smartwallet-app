import React from 'react'
import PropTypes from 'prop-types';
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
  style: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onUsernameChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
  username: PropTypes.string,
  password: PropTypes.string,
  usernameError: PropTypes.string,
  passwordError: PropTypes.string
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
