import React from 'react'
import Radium from 'radium'

function Password(props){

    return <div >
    <h1>Please enter a password:</h1>
      <input type='password' value={ props.value }  onChange={e => props.onChangePassword(e.target.value)} />
      <br/>
	  <input type='password' value={ props.repeatedValue }  onChange={e => props.onChangeRepeatedPassword(e.target.value)} />
	  <div onClick={props.onSubmit}>Next!</div>
	</div>;
}

Password.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeRepeatedPassword: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  repeatedValue:  React.PropTypes.string.isRequired,
}

export default Radium(Password)
