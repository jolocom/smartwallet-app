import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import {Loading} from '../../common'
import {
  Container,
  Content,
  Header,
  SideNote,
  Block
} from '../../structure'

export default class PasswordEntry extends React.Component {
  static propTypes = {
    security: PropTypes.object,
    checkPassword: PropTypes.func.isRequired,
    generateAndEncryptKeyPairs: PropTypes.func.isRequired
  }

  render() {
    const {pass, passReenter } = this.props.security

    const passMatch = pass === passReenter
    const allowSubmit =  passMatch && pass.length > 8 || passReenter.length > 8

    const passwordValidityCheck = (string) => {
      if (string.indexOf(' ') !== -1) {
        return (<p>No spaces allowed</p>)
      }
      if (!string.match((/[A-Z]/))) {
        return (<p>At least one uppercase letter needed.</p>)
      }
      if (!string.match((/[0-9]/))) {
        return (<p>At least one number needed.</p>)
      }
      return ''
    }

    let content
    if (this.props.progress.loading) {
      content = (
        <Loading
          size={100}
          thickness={6}
          loadingMsg={this.props.progress.loadingMsg}
        />
      )
    } else {
      content = (<div>
        <Header
          title="Please enter a secure password"
        />
        <Block>
          <SideNote style={{color: 'red', marginBottom: '16px'}}>
            The password is used to encrypt and protect your data. <br />
          </SideNote>
          <TextField
            key="pass"
            floatingLabelText="Password"
            type="password"
            value={pass}
            errorText={pass.length > 5
              ? passwordValidityCheck(pass)
              : null}
            onChange={(e) =>
              this.props.checkPassword({
                password: e.target.value,
                fieldName: 'pass'})
              }
          />
        </Block>

        <Block>
          <TextField
            key="passReenter"
            floatingLabelText="Repeat Password"
            type="password"
            value={this.props.security.passReenter}
            errorText={passMatch || passReenter.length < 5
              ? null
              : 'Make sure the passwords match!'}
            onChange={(e) =>
              this.props.checkPassword({
                password: e.target.value,
                fieldName: 'passReenter'
              })}
          />
        </Block>

        <Block>
          <RaisedButton
            label="Next"
            disabled={!allowSubmit}
            onClick={() => this.props.generateAndEncryptKeyPairs()}
            secondary />
        </Block>

        <Block>
          {this.props.security.errorMsg
            ? <div style={{color: 'red'}} >
              Ooops. Something went wrong. please try one more time.
            </div>
            : null}
        </Block>
      </div>)
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
