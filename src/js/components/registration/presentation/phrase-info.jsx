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

const PhraseInfo = (props) => {
  return (
    <Container>
      <Header
        image={<Avatar
          style={{marginBottom: '8px'}}
          src="/img/img_nohustle.svg"
          size={60} />}
        title="We created a secure phrase for you with which you can access
          your wallet again."
      />
      <Content style={{paddingTop: '0'}}>
        <Block>
          <SideNote style={{margin: '0 24px 0 24px'}}>
            Since you decided for the no hassle mode,
            we will store it for you.
            This way you can recover it through your E-Mail.
          </SideNote>
        </Block>
        <Block>
          <RaisedButton
            label="ALLRIGHT"
            secondary
            onClick={props.onSubmit} />
        </Block>
      </Content>
      <Block>
        <Avatar
          src="/img/img_techguy.svg"
          size={60}
          style={{marginBottom: '8px'}} />
        <SideNote>
          Actually, I do want to store it manually myself.
        </SideNote>
      </Block>
      <Footer>
        <FlatButton
          style={{color: theme.palette.accent1Color}}
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
