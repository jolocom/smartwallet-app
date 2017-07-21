import React from 'react'
import Radium from 'radium'

import {
  IconButton,
  Avatar
} from 'material-ui'

import {
  Container,
  Header,
  Content,
  Footer,
  InfoLink
} from '../../structure'

import LoginForm from 'components/common/login-form.jsx'

const STYLES = {
  backButton: {
    alignSelf: 'flex-start',
    position: 'absolute'
  },
  avatar: {
    marginBottom: '18px'
  }
}

const LaymanLogin = (props) => {
  return (
    <Container>
      <IconButton
        style={STYLES.backButton}
        onTouchTap={props.back}
        iconClassName="material-icons">
          arrow_back
      </IconButton>
      <Header
        image={<Avatar
          style={STYLES.avatar}
          src="/img/img_nohustle.svg"
          size={60} />}
        title={
          <div>Welcome back! <br /> Please login</div>
        }
      />
      <Content>
        <LoginForm
          onSubmit={props.onSubmit}
          username={props.username}
          password={props.password}
          onUsernameChange={props.onUsernameChange}
          onPasswordChange={props.onPasswordChange}
        />
      </Content>
      <Footer>
        <InfoLink
          info="Don't have a wallet yet?"
          link="Create one"
          to="/registration"
        />
      </Footer>
    </Container>
  )
}

LaymanLogin.propTypes = {
  back: React.PropTypes.func.isRequired,
  username: React.PropTypes.string,
  password: React.PropTypes.string,
  onUsernameChange: React.PropTypes.func.isRequired,
  onPasswordChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  failed: React.PropTypes.bool.isRequired
}

export default Radium(LaymanLogin)
