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
    'keystore/keystorage:enryptDataWithPassword']
})

export default class PasswordEntry extends React.Component {
  static propTypes = {
    keyStorage: PropTypes.obj,
    checkPassword: PropTypes.func.isRequired,
    enryptDataWithPassword: PropTypes.func.isRequired
  }

  render() {
    let noMatchMessage = ''
    if (this.props.keyStorage.passReenter.length > 5 &&
      this.props.keyStorage.pass !== this.props.keyStorage.passReenter) {
      noMatchMessage = 'The passwords do not match!'
    }
    const passwordValidityCheck = (string) => {
      if (string.indexOf(' ') !== -1) {
        return (<p>No spaces allowed</p>)
      } else if (!string.match((/[A-Z]/))) {
        return (<p>At least one uppercase letter needed.</p>)
      } else if (!string.match((/[0-9]/))) {
        return (<p>At least one number needed.</p>)
      } else {
        return ''
      }
    }

    return (
      <Container>
        <Content>
          <Block>
            <div>Please enter your password</div>
          </Block>
          <Block>
            <TextField
              key='pass'
              floatingLabelText='Password'
              type='password'
              value={this.props.keyStorage.pass}
              errorText={passwordValidityCheck(this.props.keyStorage.pass)}
              onChange={(e) =>
                this.props.checkPassword(e.target.value, 'pass')} />
          </Block>
          <Block>
            <TextField
              key='passReenter'
              floatingLabelText='Repeat Password'
              type='password'
              value={this.props.keyStorage.passReenter}
              errorText={noMatchMessage.length > 0 ? noMatchMessage : null}
              onChange={(e) =>
                this.props.checkPassword(e.target.value, 'passReenter')} />
          </Block>
          <Block>
            <FlatButton
              label='Submit your password'
              disabled={noMatchMessage.length > 0 || this.props.keyStorage.pass.length < 8}
              onClick={() => this.props.enryptDataWithPassword()}
              secondary />
          </Block>
        </Content>
      </Container>
    )
  }
}
