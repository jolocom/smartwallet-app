import React from 'react'
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import {RaisedButton, FlatButton} from 'material-ui'
import {
  NavigationExpandMore,
  NavigationExpandLess
} from 'material-ui/svg-icons'

import {Container, Header, Content, Block, Footer
} from '../../structure'
import {theme} from 'styles'

const STYLES = {
  heading: {
    fontSize: '18pt',
    fontWeight: '300',
    color: '#939393',
    margin: '20px',
    textAlign: 'center'
  },
  floatingLabel: {
    textAlign: 'center',
    width: '100%',
    transformOrigin: 'center top 0px'
  },
  inputStyle: {
    textAlign: 'center'
  },
  embeddedLink: {
    color: theme.palette.accent1Color,
    minWidth: '0px',
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  textField: {
    marginTop: '10%',
    alignItems: 'center'
  },
  backgroundColor: theme.jolocom.gray4,
  popupText: theme.textStyles.textCopy,
  popupAccent: {
    color: theme.palette.accent1Color
  }
}

const NameEntry = (props) => {
  let errorText = null
  if (props.ownURL.valueOwnURL.length > 1 && props.ownURL.valueOwnURL.length < 14) { // eslint-disable-line max-len
    errorText = 'Address is too short. Please check.'
  } else if (props.ownURL.valueOwnURL.length > 14 && props.ownURL.valueOwnURL.indexOf('https://') === -1) { // eslint-disable-line max-len
    errorText = 'Please fill in whole address (like: https://www.me.io)'
  }
  return (
    <Container>
      <Header title="Let's get started! Please type in a username." />
      <Content>
        <Block style={STYLES.textField}>
          <TextField
            defaultValue={props.value}
            floatingLabelText="Unique Username"
            floatingLabelStyle={STYLES.floatingLabel}
            inputStyle={STYLES.inputStyle}
            onChange={(e) => props.onChange(e.target.value)}
            errorText={props.errorMsg} />
        </Block>
        <Block>
          <FlatButton
            label="Register with personal space"
            labelPosition="before"
            secondary
            onClick={() => props.toggleHasOwnURL(!props.ownURL.hasOwnURL)}
            icon={props.ownURL.hasOwnURL ? <NavigationExpandLess />
              : <NavigationExpandMore />} />
        </Block>
        {props.ownURL.hasOwnURL ? <Block>
          <TextField
            id="valueOwnURL"
            hintText="Your personal space address"
            value={props.ownURL.valueOwnURL}
            errorText={errorText || props.ownURL.errorMsg}
            onChange={(e) => props.setValueOwnURL(e.target.value)}
            />
        </Block> : null}
      </Content>
      <Footer>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit}
          disabled={!props.value}
        />
      </Footer>
    </Container>
  )
}

NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  ownURL: React.PropTypes.object,
  valid: React.PropTypes.bool.isRequired,
  errorMsg: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  handleDialog: React.PropTypes.func.isRequired,
  setValueOwnURL: React.PropTypes.func.isRequired,
  toggleHasOwnURL: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
