import React from 'react'
import Radium from 'radium'

function Password(props){
    return <div >
      <input type={ props.visibleValue } value={ props.value }  onChange={e => props.onChangePassword(e.target.value)} />
      <br/>
      <div onClick={props.onTogglePasswordValue}>toggle</div>
	  <input type={ props.visibleRepeatedValue } value={ props.repeatedValue }  onChange={e => props.onChangeRepeatedPassword(e.target.value)} />
	  <div onClick={ props.onSubmit }>Next!</div>
	</div>;
}

Password.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeRepeatedPassword: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  onTogglePasswordValue: React.PropTypes.func.isRequired,
  onToggleRepeatedPasswordValue: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  visibleValue: React.PropTypes.string.isRequired,
  repeatedValue:  React.PropTypes.string.isRequired,
  visibleRepeatedValue: React.PropTypes.string.isRequired,
}

export default Radium(Password)
