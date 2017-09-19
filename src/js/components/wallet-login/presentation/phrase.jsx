import React from 'react'
import Radium from 'radium'

import {
  IconButton,
  RaisedButton,
  Avatar,
  TextField,
  FlatButton
} from 'material-ui'

import {
  NavigationExpandMore,
  NavigationExpandLess
} from 'material-ui/svg-icons'

import {
  Container,
  Header,
  Content,
  Block,
  Footer,
  FailureMessage
} from '../../structure'

const STYLES = {
  backButton: {
    alignSelf: 'flex-start',
    position: 'absolute'
  },
  phraseInput: {
    backgroundColor: '#fff',
    padding: '2px'
  },
  phraseInputText: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '100',
    lineHeight: '30px',
    overflow: 'hidden'
  },
  avatar: {
    marginBottom: '18px'
  }
}

const Passphrase = (props) => {
  const {passphrase} = props
  let errorText = null
  if (passphrase.valueOwnURL.length > 1 && passphrase.valueOwnURL.length < 14) {
    errorText = 'Address is too short. Please check.'
  } else if (passphrase.valueOwnURL.length > 14 && passphrase.valueOwnURL.indexOf('https://') === -1) { // eslint-disable-line max-len
    errorText = 'Please fill in whole address (like: https://www.me.io)'
  }
  return (
    <Container>
      <IconButton
        style={STYLES.backButton}
        onClick={props.back}
        iconClassName="material-icons">
          arrow_back
      </IconButton>
      <Header
        image={<Avatar
          style={STYLES.avatar}
          src="/img/img_techguy.svg"
          size={60} />}
        title={
          <div>Welcome back! <br /> Please enter your secure passphrase.</div>
        }
      />
      <Content>
        <Block>
        {passphrase.failed ? <FailureMessage>
        That passphrase doesn't match our records
        </FailureMessage> : ''}
        </Block>
        <Block>
          <TextField
            id="phraseInput"
            style={STYLES.phraseInput}
            textareaStyle={STYLES.phraseInputText}
            value={passphrase.value}
            type="text"
            underlineShow={false}
            multiLine
            onChange={(e) => { props.onChange(e.target.value) }}
            />
        </Block>
        <Block>
          <FlatButton
            label="Login with personal space"
            labelPosition="before"
            secondary
            onClick={() => props.toggleHasOwnURL(!passphrase.hasOwnURL)}
            icon={passphrase.hasOwnURL ? <NavigationExpandLess />
              : <NavigationExpandMore />} />
        </Block>
        {passphrase.hasOwnURL ? <Block>
          <TextField
            id="valueOwnURL"
            hintText="Your personal space address"
            value={passphrase.valueOwnURL}
            errorText={errorText}
            onChange={(e) => props.setValueOwnURL(e.target.value)} />
        </Block> : null}
      </Content>
      <Footer>
        <RaisedButton
          label="LOGIN"
          secondary
          disabled={!passphrase.value}
          onClick={props.onSubmit} />
      </Footer>
    </Container>
  )
}

Passphrase.propTypes = {
  back: React.PropTypes.func.isRequired,
  canSubmit: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  toggleHasOwnURL: React.PropTypes.func.isRequired,
  setValueOwnURL: React.PropTypes.func.isRequired
}

export default Radium(Passphrase)
