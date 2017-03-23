import React from 'react'
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import {RaisedButton} from 'material-ui'

import {Container, Header, Content, SideNote, Footer} from './ui'

const STYLES = {
  heading: {
    fontSize: '18pt',
    fontWeight: '300',
    color: '#939393',
    margin: '20px',
    textAlign: 'center'
  },
  floatingLabel: {
    textAlign: 'center',
    width: '100%',
    transformOrigin: 'center top 0px'
  },
  inputStyle: {
    textAlign: 'center'
  },
  sidenote: {
    fontSize: '11pt',
    fontWeight: '300',
    color: '#939393',
    margin: '20px',
    textAlign: 'center'
  }
}

const NameEntry = (props) => {
  return (
    <Container>
      <Header title="Let's get started! Please type in a username." />
      <Content>
        <SideNote>
          It needs to be unique, but choose wisely,
          <br />
          It will be part of your
          <span style={{color: '#942f51'}}> WebID</span> and it might<br />
          end up on your buiseness card one day.
        </SideNote>
        <TextField
          style={{'marginTop': '10%'}}
          defaultValue={props.value}
          floatingLabelText="Unique Username"
          floatingLabelStyle={STYLES.floatingLabel}
          inputStyle={STYLES.inputStyle}
          onChange={(e) => props.onChange(e.target.value)}
          errorText=""
        />
      </Content>
      <Footer>
        <RaisedButton
          style={{'margin': '4%'}}
          label="next step"
          secondary
          onClick={props.onSubmit}
          disabled={!props.valid}
        />
      </Footer>
    </Container>
  )
}

NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
