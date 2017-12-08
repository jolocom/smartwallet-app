import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import Info from 'material-ui/svg-icons/action/info'

import {theme} from 'styles'

const STYLES = {
  iconName: {
    fill: theme.palette.accent1Color,
    position: 'absolute',
    right: '55px',
    marginTop: '30px'
  },
  inputStyleName: {
    textAlign: 'center',
    color: theme.palette.textColor_silverGrey,
    marginBottom: '-5px'
  },
  inputStyle: {
    textAlign: 'center',
    marginBottom: '-5px'
  },
  floatingLabel: {
    textAlign: 'center',
    width: '100%',
    transformOrigin: 'center top 0px',
    color: theme.palette.textColor_silverGrey,
    paddingTop: '5px',
    borderTop: '1px solid',
    borderColor: theme.palette.textColor_silverGrey
  }
}

const InfoDetails = (props) => {
  const {username = '', webId = '', showDetails} = props
  const personalDetails = <span>
    <TextField
      id="usernameField"
      value={username}
      errorText="is your username"
      errorStyle={STYLES.floatingLabel}
      inputStyle={STYLES.inputStyleName}
      underlineShow={false}
      fullWidth
    />
    <br />
    <TextField
      id="webIdField"
      value={webId}
      errorText="is your WebID"
      errorStyle={STYLES.floatingLabel}
      inputStyle={STYLES.inputStyle}
      underlineShow={false}
      fullWidth
    />
  </span>

  return (<span onClick={() => showDetails(personalDetails)}>
    <Info style={STYLES.iconName} />
  </span>)
}

InfoDetails.propTypes = {
  showDetails: PropTypes.func,
  username: PropTypes.string,
  webId: PropTypes.string
}

export default Radium(InfoDetails)
