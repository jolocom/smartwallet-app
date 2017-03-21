import React from 'react'
import Radium from 'radium'
import PasswordField from 'material-ui-password-field'
import RegistrationStyles from '../styles'
import Theme from '../../../styles/jolocom-theme'
import {RaisedButton} from 'material-ui'

const STYLES = {
  root: RegistrationStyles.container,
  Password: {
    margin: '0px 30px 10px 30px',
    backgroundColor: '#ffffff'
  },
  input: {
    display: 'inline-block'
  },
  strengthBare:{
  	marginRight: '30px',
  	marginLeft: '30px'
  },
  explanation: {
  	marginTop:'20px',
    color: Theme.jolocom.gray1
  },
  button: {
    display: 'inline-block',
    marginTop: '30px',
  }
}

const strengthBarraColor = (props) => {
	switch(props.strength) {
		case 'strong':
		  return 'green'
		case 'good':
			return 'yellow'
		default:
			return 'red'
	}
}

const showBare = (props, id) => {
	if (props.strength === 'strong') {
		return 'visible'
	}
	if(props.value && id === 1){
		return 'visible'
	}
	if (props.strength !== 'weak' && id ===2) {
		return 'visible'
	}
	return 'hidden'
}

const repeatedValueVisibility = (props) => {
	const enabledField = (
		props.upperCase &&
		props.lowerCase &&
		props.digit &&
		props.value.length > 7
	)
	return !enabledField
}

const errorMessage = (props) => {
	if(repeatedValueVisibility(props)) {
		return ''
	}
	const number = props.value.length > 7? '': '8 characters'
	const digit = props.digit? '': 'one digit, '
	const lowerCase = props.digit? '': 'one lower case, '
	const upperCase = props.upperCase? '': 'one upper case, '
	return 'please enter at least' +
		number +
		digit +
		lowerCase +
		upperCase +
		' !'
}

function Password(props) {
	return <div style={STYLES.root}>
		<div style={STYLES.Password}>
			<PasswordField
				style={STYLES.Password}
				floatingLabelText="Password"
			  hintText={props.strength + " password"}
				value={props.value}
				onChange={
					e => props.onChangePassword(e.target.value)
				}
			/>
			<div style={STYLES.strengthBare}>
				<svg width="100%" height="4">
		    	<line
		    		x1="0%"
		    		y1="2"
		    		x2="30%"
		    		y2="2"
						visibility={showBare(props, 1)}
						strokeWidth="4"
						stroke={strengthBarraColor(props)}
		    	/>
		    	<line
			    	x1="33%"
			    	y1="2"
			    	x2="67%"
			    	y2="2"
			    	visibility={showBare(props, 2)}
			    	strokeWidth="4" stroke={strengthBarraColor(props)}
			    />
		    	<line
			    	x1="70%"
			    	y1="2"
			    	x2="100%"
			    	y2="2"
			    	visibility={showBare(props, 3)}
			    	strokeWidth="4"
			    	stroke={strengthBarraColor(props)}
			    />
	 			</svg>
 			</div>
			<PasswordField
				style={STYLES.Password}
				floatingLabelText="Repeat Password"
				disabled={ repeatedValueVisibility(props) }
				id='1'
				type={props.visibleRepeatedValue}
				value={props.repeatedValue}
				onChange={
					e => props.onChangeRepeatedPassword(e.target.value)
				}
			/>
		</div>
		<div
			style={STYLES.explanation}
			hidden={
				props.valid? "hidden": ""
			}
		>
			<dl>
			<dt>For more security please use at least :</dt>
				<dd>- one Number</dd>
				<dd>- one Upper Case (e.g. A,B,C...)</dd>
				<dd>- one Lower Case (e.g. a,b,c...)</dd>
			</dl>
		</div>
	  <div style={STYLES.button} >
      <RaisedButton
        disabled={!props.valid}
        secondary={props.valid}
        label='NEXT STEP'
        onClick={props.onSubmit}
      />
    </div>
	</div>
}

Password.propTypes = {
	onSubmit: React.PropTypes.func.isRequired,
	onChangeRepeatedPassword: React.PropTypes.func.isRequired,
	onChangePassword: React.PropTypes.func.isRequired,
	value: React.PropTypes.string.isRequired,
	valid: React.PropTypes.bool.isRequired,
	repeatedValue: React.PropTypes.string.isRequired,
	digit: React.PropTypes.bool.isRequired,
	lowerCase:  React.PropTypes.bool.isRequired,
	upperCase:  React.PropTypes.bool.isRequired,
	strength: React.PropTypes.string.isRequired
 }

export default Radium(Password)
