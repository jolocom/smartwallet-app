import React from 'react'
import Radium from 'radium'
import PasswordField from 'material-ui-password-field'

function Password(props) {
	return <div >
		<div  className='heere' style={{backgroundColor: '#f0f0f0',position: 'absolute', left: '25%',right: '25%'}}>
			<PasswordField
				style={{ position: 'relative', left: 'center'}}
				floatingLabelText="Password"
				floatingLabelFocusStyle={{align: 'center'}}
				value={props.value}
				onChange={
					e => props.onChangePassword(e.target.value)
				}
			/>
			<svg width="100%" height="4">
	    	<line x1="0%" y1="1" x2="30%" y2="1" visibility={ props.showFirstBare } stroke-width="4" stroke={props.passwordBarreColor} />
	    	<line x1="33%" y1="1" x2="67%" y2="1" visibility={ props.showSecondBare } stroke-width="2" stroke={props.passwordBarreColor} />
	    	<line x1="70%" y1="1" x2="100%" y2="1" visibility={ props.showThirdBare } stroke-width="2" stroke={props.passwordBarreColor} />
 			</svg>
			<PasswordField
				style={{ position: 'relative', left: 'center'}}
				floatingLabelText="Repeat Password"
				disabled={ props.repeatedValueState }
				id='1'
				type={props.visibleRepeatedValue}
				value={props.repeatedValue}
				onChange={
					e => props.onChangeRepeatedPassword(e.target.value)
				}
			/>
			<div onClick={props.onSubmit}>Next!</div>
		</div>
	</div>
}

Password.propTypes = {
	onSubmit: React.PropTypes.func.isRequired,
	onChangeRepeatedPassword: React.PropTypes.func.isRequired,
	onChangePassword: React.PropTypes.func.isRequired,
	value: React.PropTypes.string.isRequired,
	valid: React.PropTypes.bool.isRequired,
	repeatedValueState: React.PropTypes.bool.isRequired,
	repeatedValue: React.PropTypes.string.isRequired,
	showFirstBare: React.PropTypes.string.isRequired,
	showSecondBare: React.PropTypes.string.isRequired,
	showThirdBare: React.PropTypes.string.isRequired,
 	strength: React.PropTypes.string.isRequired, 
 	showRepeatedValueFirstBare: React.PropTypes.string.isRequired,
  showRepeatedValueSecondBare: React.PropTypes.string.isRequired,
  passwordBarreColor: React.PropTypes.string.isRequired,
  showRepeatedValueThirdBare: React.PropTypes.string.isRequired
}

export default Radium(Password)
