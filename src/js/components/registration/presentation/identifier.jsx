import React from 'react'
import Radium from 'radium'

import {Container, Header, Content, Footer} from './ui'

const Identifier = (props) => {
  return (
    <Container>
      <Header title="Please enter e-mail" />
      <Content>
        <input
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </Content>
      <Footer>
        <div onClick={props.onSubmit}>Next!</div>
      </Footer>
    </Container>
  )
}

Identifier.propTypes = {
  value: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default Radium(Identifier)
