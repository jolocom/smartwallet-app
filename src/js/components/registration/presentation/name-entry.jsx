import React from 'react'
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import {RaisedButton} from 'material-ui'

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
            errorText={props.errorMsg}
          />
        </Block>
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
  valid: React.PropTypes.bool.isRequired,
  errorMsg: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  handleDialog: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
