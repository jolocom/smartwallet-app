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
  props: ['keystore.security'],
  actions: ['keystore/security:checkPassword',
    'keystore/security:encryptDataWithPassword']
})

export default class PasswordEntry extends React.Component {
  static propTypes = {
    security: PropTypes.object,
    checkPassword: PropTypes.func.isRequired,
    encryptDataWithPassword: PropTypes.func.isRequired
  }

  render() {
    let noMatchMessage = ''
    if (this.props.security.passReenter.length > 5 &&
      this.props.security.pass !== this.props.security.passReenter) {
      noMatchMessage = 'The passwords do not match!'
    }
    const allowSubmit = noMatchMessage.length > 0 || this.props.security.pass.length < 8 || this.props.security.passReenter.length < 8 // eslint-disable-line max-len
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
    let content
    if (this.props.security.loading) {
      content = (
        <Loading />
      )
    } else {
      content = (<div>
        <Block>
          <div>Please enter your password</div>
        </Block>
        <Block>
          <TextField
            key="pass"
            floatingLabelText="Password"
            type="password"
            value={this.props.security.pass}
            errorText={this.props.security.pass.length > 5
              ? passwordValidityCheck(this.props.security.pass)
              : null}
            onChange={(e) =>
              this.props.checkPassword(e.target.value, 'pass')} />
        </Block>
        <Block>
          <TextField
            key="passReenter"
            floatingLabelText="Repeat Password"
            type="password"
            value={this.props.security.passReenter}
            errorText={noMatchMessage.length > 0 ? noMatchMessage : null}
            onChange={(e) =>
              this.props.checkPassword(e.target.value, 'passReenter')} />
        </Block>
        <Block>
          <FlatButton
            label="Submit your password"
            disabled={allowSubmit}
            onClick={() => this.props.encryptDataWithPassword()}
            secondary />
        </Block>
        <Block>
          {this.props.security.errorMsg
            ? <div style={{color: 'red'}}>Ooops. Something went wrong. please try one more time</div> // eslint-disable-line max-len
            : null}
        </Block></div>
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
