import React from 'react'
import Radium from 'radium'

import {
  RaisedButton,
  FlatButton,
  Avatar
} from 'material-ui'

import {Container, Header, Content, Block, Footer} from '../../structure'
import {SideNote} from './ui'

const PhraseInfo = (props) => {
  return (
    <Container>
      <Header
        image={<Avatar
          src="/img/img_nohustle.svg"
          size={60} />}
        title="We created a secure phrase for you with which you can access your
          wallet again."
      />
      <Content>
        <Block>
          <SideNote>
            Since you decided for the no hassle mode, we will store it for you.
            This way you can recover it through your E-Mail.
          </SideNote>
        </Block>
        <Block>
          <RaisedButton
            label="AlRIGHT"
            secondary
            onClick={props.onSubmit} />
        </Block>
      </Content>
      <Block>
        <Avatar
          src="/img/img_techguy.svg"
          size={60} />
      </Block>
      <Block>
        <SideNote>
          Actually, I do want to store it manually myself.
        </SideNote>
      </Block>
      <Footer>
        <FlatButton
          label="SHOW SECURE PHRASE"
          onClick={() => { props.onChange('expert'); props.onSubmit() }} />
      </Footer>
    </Container>
  )
}

PhraseInfo.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(PhraseInfo)
