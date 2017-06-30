import React from 'react'
import Radium from 'radium'

import {TextField} from 'material-ui'
import Info from 'material-ui/svg-icons/action/info'

import {theme} from 'styles'

const STYLES = {
  iconName: {
    fill: theme.palette.accent1Color,
    position: 'absolute',
    right: '20px',
    marginTop: '40px'
  },
  inputStyle: {
    textAlign: 'center',
    marginBottom: '-5px'
  },
  floatingLabel: {
    textAlign: 'center',
    width: '100%',
    transformOrigin: 'center top 0px',
    color: theme.palette.lighterTextColor,
    paddingTop: '5px',
    borderTop: '1px solid',
    borderColor: theme.palette.lighterTextColor
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
      inputStyle={STYLES.inputStyle}
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
  showDetails: React.PropTypes.func,
  username: React.PropTypes.string,
  webId: React.PropTypes.string
}

export default Radium(InfoDetails)
