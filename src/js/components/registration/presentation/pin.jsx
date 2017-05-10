import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import PinInput from './pin-input'

import {theme} from 'styles'

import {Container, Header, Content, Block, Footer} from '../../structure'

const STYLES = {
  input: {
    display: 'inline-block'
  },
  changeLink: {
    margin: '20px 0',
    color: theme.palette.accent1Color,
    textTransform: 'uppercase'
  },
  explanation: {
    marginTop: '20px',
    color: theme.jolocom.gray1
  },
  content: {
    padding: '16px',
    flex: 1
  }
}

function getButtonLabel(props) {
  if (!props.valid) {
    return 'Almost done'
  }
  if (props.confirm) {
    return 'All right'
  } else {
    return 'Done'
  }
}

const Pin = (props) => {
  let confirm

  if (props.confirm) {
    confirm = (
      <Block>
        <div
          style={STYLES.changeLink}
          onClick={props.onChangeRequest}
        >
          Change secure PIN
        </div>
        <div style={STYLES.explanation}>
          This secure PIN will be needed for transactions and
          saving information on the Blockchain.
        </div>
      </Block>
    )
  }

  let headerTitle

  if (props.confirm) {
    headerTitle = 'Your Secure PIN.'
  } else {
    headerTitle = 'Create a PIN for secure login.'
  }

  return (
    <Container>
      <Header title={headerTitle} />
      <Content style={STYLES.content}>
        <PinInput
          value={props.value}
          focused={props.focused}
          disabled={props.confirm}
          onChange={props.onChange}
          onFocusChange={props.onFocusChange}
          confirm={props.confirm} />

        {confirm}
      </Content>

      <Footer>
        <RaisedButton
          disabled={!props.valid}
          secondary={props.valid}
          label={getButtonLabel(props)}
          onClick={() => { props.onSubmit() }}
        />
      </Footer>
    </Container>
  )
}

Pin.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  focused: React.PropTypes.bool.isRequired,
  confirm: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onChangeRequest: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onFocusChange: React.PropTypes.func.isRequired
}

export default Radium(Pin)
