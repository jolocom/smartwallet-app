import React from 'react'
import Radium from 'radium'

function Password(props) {
	return <div >
		<input
			type={props.visibleValue}
			value={props.value}
			onChange={
				e => props.onChangePassword(e.target.value)
			}
		/>

		<div onClick={
			e => props.onTogglePasswordValue(e.target.value)
		}>
			toggle!
		</div>

		<input
			type={props.visibleRepeatedValue}
			value={props.repeatedValue}
			onChange={
				e => props.onChangeRepeatedPassword(e.target.value)
			}
		/>
		<div onClick={
			e => props.onTogglePasswordRepeatedValue(e.target.value)
		}>
			toggle!
		</div>
		<div onClick={props.onSubmit}>Next!</div>
	</div>
}

Password.propTypes = {
	onSubmit: React.PropTypes.func.isRequired,
	onChangeRepeatedPassword: React.PropTypes.func.isRequired,
	onChangePassword: React.PropTypes.func.isRequired,
	onTogglePasswordValue: React.PropTypes.func.isRequired,
	onTogglePasswordRepeatedValue: React.PropTypes.func.isRequired,
	value: React.PropTypes.string.isRequired,
	visibleValue: React.PropTypes.string.isRequired,
	repeatedValue: React.PropTypes.string.isRequired,
	visibleRepeatedValue: React.PropTypes.string.isRequired
}

export default Radium(Password)
