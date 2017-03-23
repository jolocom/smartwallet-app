import React from 'react'
import Radium from 'radium'

import {
  RaisedButton,
  TextField
} from 'material-ui'

import {Container, Header, Content, Footer} from './ui'

const NameEntry = (props) => {
  return (
    <Container>
      <Header title="Name entry" />
      <Content>
        <TextField
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </Content>
      <Footer>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit} />
      </Footer>
    </Container>
  )
}

NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
