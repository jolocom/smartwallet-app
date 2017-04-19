import React from 'react'
import Radium from 'radium'
import {RaisedButton, TextField} from 'material-ui'

import {Container, Header, Content, Footer, Block} from '../../structure'

const STYLES = {
  usernameField: {
    margin: '0px 30px 0px 30px',
    backgroundColor: '#ffffff'
  },
  emailField: {
    margin: '0px 30px 40px 30px',
    backgroundColor: '#ffffff'
  },
  fieldContainer: {
    marginTop: '15%',
    backgroundColor: '#ffffff'
  }
}
const Identifier = (props) => {
  return (
    <Container>
      <Header title="For the creation of your account we need your e-mail" />
      <Content>
        <Block style={STYLES.fieldContainer}>
          <TextField
            style={STYLES.usernameField}
            underlineShow={false}
            floatingLabelText="Username"
            value={props.username}
          />
          <br />
          <TextField
            style={STYLES.emailField}
            floatingLabelText="E-mail address"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        </Block>
      </Content>
      <Footer>
        <RaisedButton
          onClick={props.onSubmit}
          label="NEXT STEP"
          secondary
          disabled={!props.valid}
        />
      </Footer>
    </Container>
  )
}

Identifier.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  username: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default Radium(Identifier)
