import React from 'react'
import Radium from 'radium'

import PinInput from 'components/registration/presentation/pin-input.jsx'

import {
  RaisedButton,
  Avatar
} from 'material-ui'

import {
  Container,
  Header,
  Content,
  Block,
  FailureMessage,
  Footer
} from './ui'

const Pin = (props) => {
  return (
    <Container>
      <Header
        image={<Avatar
          src="/img/img_techguy.svg"
          size={60} />}
        title="Welcome back!\nPlease enter your Pin."
      />
      <Content>
      {props.failed ? <FailureMessage>
      That pin doesn't match our records
      </FailureMessage> : ''}
        <Block>
          <PinInput
            value={props.value}
            focused={props.focused}
            disabled={!props.canSubmit}
            onChange={props.onChange}
            onFocusChange={props.onFocusChange}
            confirm={false} />
        </Block>
      </Content>
      <Footer>
        <RaisedButton
          label="LOGIN"
          secondary
          disabled={!props.valid}
          onClick={props.onSubmit} />
      </Footer>
    </Container>
  )
}

Pin.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  focused: React.PropTypes.bool.isRequired,
  canSubmit: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onReset: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onFocusChange: React.PropTypes.func.isRequired,
  failed: React.PropTypes.bool
}

export default Radium(Pin)
