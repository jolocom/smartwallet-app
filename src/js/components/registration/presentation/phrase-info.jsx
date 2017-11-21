import React from 'react'
import Radium from 'radium'
import {theme} from 'styles'

import {
  RaisedButton,
  FlatButton,
  Avatar
} from 'material-ui'

import {Container, Header, Content, Block, Footer, SideNote}
from '../../structure'

const STYLES = {
  avatar: {
    margin: 'auto auto 18px auto'
  },
  sidenote: {
    margin: '0 24px 16px 24px'
  },
  content: {
    paddingTop: '0'
  },
  button: {
    color: theme.palette.accent1Color
  }
}

const PhraseInfo = (props) => {
  return (
    <Container>
      <Header
        image={<Avatar
          style={STYLES.avatar}
          src="/img/img_nohustle.svg"
          size={60} />}
        title="We created a secure phrase for you with which you can access
          your wallet again."
      />
      <Content style={STYLES.content}>
        <Block>
          <SideNote style={STYLES.sidenote}>
            Since you decided for the no hassle mode,
            we will store it for you.
            This way you can recover it through your E-Mail.
          </SideNote>
        </Block>
        <Block>
          <RaisedButton
            label="ALL RIGHT"
            secondary
            onClick={props.onSubmit} />
        </Block>
      </Content>
      <Block>
        <Avatar
          src="/img/img_techguy.svg"
          size={60}
          style={STYLES.avatar} />
        <SideNote>
          Actually, I do want to store it manually myself.
        </SideNote>
      </Block>
      <Footer>
        <FlatButton
          style={STYLES.button}
          label="SHOW SECURE PHRASE"
          onClick={() => { props.onChange() }} />
      </Footer>
    </Container>
  )
}

PhraseInfo.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(PhraseInfo)
