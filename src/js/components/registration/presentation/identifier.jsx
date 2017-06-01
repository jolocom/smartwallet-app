import React from 'react'
import Radium from 'radium'
import {RaisedButton, TextField} from 'material-ui'

import {Container, Header, Content, Footer, Block} from '../../structure'

const STYLES = {
  usernameField: {
    backgroundColor: '#ffffff',
    width: '100%'
  },
  emailField: {
    backgroundColor: '#ffffff',
    width: '100%'
  },
  content: {
    padding: '16px'
  },
  fieldContainer: {
    width: '300px',
    maxWidth: '90%',
    padding: '0px 20px 20px',
    margin: '10px auto 20px auto',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff'
  }
}
const Identifier = (props) => {
  return (
    <Container>
      <Header title="For the creation of your account we need your e-mail" />
      <Content style={STYLES.content}>
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
            errorText={props.errorMsg}
          />
        </Block>
      </Content>
      <Footer>
        <RaisedButton
          onClick={props.onSubmit}
          label="NEXT STEP"
          secondary
        />
      </Footer>
    </Container>
  )
}

Identifier.propTypes = {
  value: React.PropTypes.string.isRequired,
  errorMsg: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default Radium(Identifier)
