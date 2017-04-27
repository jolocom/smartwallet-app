import React from 'react'
import Radium from 'radium'

import {
  RaisedButton,
  Avatar,
  TextField
} from 'material-ui'

import {
  Container,
  Header,
  Content,
  Block,
  Footer,
  FailureMessage
} from './ui'

const STYLES = {
  phraseInput: {
    backgroundColor: '#fff',
    padding: '10px'
  },
  phraseInputText: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '100',
    lineHeight: '30px',
    overflow: 'hidden'
  }
}

const Passphrase = (props) => {
  return (
    <Container>
      <Header
        image={<Avatar
          src="/img/img_techguy.svg"
          size={60} />}
        title="Welcome back!\nPlease enter your secure passphrase."
      />
      <Content>
        <Block>
        {props.failed ? <FailureMessage>
        That passphrase doesn't match our records
        </FailureMessage> : ''}
        </Block>
        <Block>
          <TextField
            id="phraseInput"
            style={STYLES.phraseInput}
            textareaStyle={STYLES.phraseInputText}
            value={props.value}
            type="text"
            underlineShow={false}
            multiLine
            onChange={(e) => { props.onChange(e.target.value) }}
            />
        </Block>
      </Content>
      <Footer>
        <RaisedButton
          label="LOGIN"
          secondary
          onClick={props.onSubmit} />
      </Footer>
    </Container>
  )
}

Passphrase.propTypes = {
  value: React.PropTypes.string.isRequired,
  canSubmit: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  failed: React.PropTypes.bool.isRequired
}

export default Radium(Passphrase)
