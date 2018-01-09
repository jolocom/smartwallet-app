import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'redux_state/utils'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import {Loading} from '../common'
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
    openConfirmDialog: PropTypes.func.isRequired,
    keyStorage: PropTypes.object
  }

  showPasswordWindow() {
    const message = (
      <div>
        <TextField
          key="pass"
          floatingLabelText="Password"
          type="password"
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
    let content
    if (this.props.keyStorage.loading) {
      content = (
        <Loading />
      )
    } else {
      content = (
        <div>
          <Block>
            <div>Test Password PopUp</div>
          </Block>
          <Block>
            <FlatButton
              label="Test PopUp"
              onClick={() => this.showPasswordWindow()}
              secondary />
          </Block>
          <Block>
            {this.props.keyStorage.errorMsg
              ? <div style={{color: 'red'}}>Ooops. Something went wrong. please try one more time</div> // eslint-disable-line max-len
              : null}
          </Block>
        </div>
      )
    }
    return (
      <Container>
        <Content>
          {content}
        </Content>
      </Container>
    )
  }
}
