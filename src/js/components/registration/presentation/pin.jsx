import React from 'react'
import Radium from 'radium'
import {RaisedButton} from 'material-ui'
import PinInput from './pin-input'
import {Form} from 'formsy-react'
import Spinner from '../../common/spinner'
import {theme} from 'styles'

import {Container, Header, Content, Block, Footer, SideNote}
  from '../../structure'

const STYLES = {
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '30px 0'
  },
  input: {
    display: 'inline-block'
  },
  changeLink: {
    margin: '20px 0',
    color: theme.palette.accent1Color,
    textTransform: 'uppercase'
  },
  content: {
    padding: '16px',
    flex: 1
  },
  sidenote: {
    margin: '10px'
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
      </Block>
    )
  }

  let headerTitle
  let contents
  if (props.confirm) {
    headerTitle = 'Your Secure PIN.'
  } else {
    headerTitle = 'Create a PIN for secure login.'
  }

  if (props.registering) {
    const messageWait = ['Please have some patience...',
      '...we are creating...', '...your jolocom wallet...',
      '...your digital identity', '...we are linking...',
      '...your WebID to your identity']

    contents = (
      <Block>
        <Spinner style={STYLES.header} message={messageWait}
          avatar={'url(/img/img_techguy.svg)'} />
      </Block>
    )
  } else {
    contents = (
      <Form onValidSubmit={() => { props.onSubmit() }} style={STYLES.form}>
        <Header title={headerTitle} />
        <Content style={STYLES.content}>
          <PinInput
            value={props.value}
            focused={props.focused}
            disabled={props.confirm}
            onChange={props.onChange}
            onFocusChange={props.onFocusChange}
            confirm={props.confirm} />
            {
              props.confirm
              ? null
              : <Block>
                <SideNote style={STYLES.sidenote}>
                  This secure PIN will be needed for transactions and
                  saving information on the Blockchain.
                </SideNote>
              </Block>
            }
          {confirm}
        </Content>

        <Footer>
          <RaisedButton
            type="submit"
            disabled={!props.valid}
            secondary={props.valid}
            label={getButtonLabel(props)}
          />
        </Footer>
      </Form>
    )
  }
  return (
    <Container>
      {contents}
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
