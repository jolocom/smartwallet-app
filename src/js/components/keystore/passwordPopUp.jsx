import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'redux_state/utils'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import {
  Container,
  Content,
  Block
} from '../structure'

@connect({
  props: ['keystore.keyStorage'],
  actions: ['keystore/keystorage:checkPassword',
    'keystore/keystorage:decryptDataWithPassword',
    'confirmation-dialog:openConfirmDialog'
  ]
})

export default class PasswordPopUp extends React.Component {
  static propTypes = {
    checkPassword: PropTypes.func.isRequired,
    decryptDataWithPassword: PropTypes.func.isRequired,
    openConfirmDialog: PropTypes.func.isRequired
  }

  showPasswordWindow() {
    const message = (
      <div>
        <TextField
          key='pass'
          floatingLabelText='Password'
          type='password'
          onChange={(e) =>
            this.props.checkPassword(e.target.value, 'pass')} />
      </div>
    )

    const popUp = {
      title: 'Please enter your password!',
      message: message,
      callback: () => this.props.decryptDataWithPassword(),
      rightButtonLabel: 'SUBMIT',
      leftButtonLabel: 'CANCEL'
    }
    return this.props.openConfirmDialog(popUp.title, popUp.message,
      popUp.rightButtonLabel, popUp.callback, popUp.leftButtonLabel)
  }

  render() {
    return (
      <Container>
        <Content>
          <Block>
            <div>Test Password PopUp</div>
          </Block>
          <Block>
            <FlatButton
              label='Test PopUp'
              onClick={() => this.showPasswordWindow()}
              secondary />
          </Block>
        </Content>
      </Container>
    )
  }
}
