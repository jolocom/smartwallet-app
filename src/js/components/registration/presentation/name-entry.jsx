import React from 'react'
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
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
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
}

const NameEntry = (props) => {
  let spinner = null
  if (props.checking) {
    spinner = <CircularProgress style={STYLES.spinner} />
  }
  return (
    <Container>
      <Header title="Let's get started! Please type in a username." />
      <Content>
        <SideNote>
          It needs to be unique, but choose wisely,
          <br />
          It will be part of your
          <span style={{color: '#942f51'}}> WebID</span> and it might<br />
          end up on your business card one day.
        </SideNote>
        <TextField
          style={{'marginTop': '10%'}}
          defaultValue={props.value}
          floatingLabelText="Unique Username"
          floatingLabelStyle={STYLES.floatingLabel}
          inputStyle={STYLES.inputStyle}
          onChange={(e) => props.onChange(e.target.value)}
          errorText={props.errorMsg}
        />
        {spinner}
      </Content>
      <Footer>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit}
          disabled={props.blank}
        />
      </Footer>
    </Container>
  )
}

NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  blank: React.PropTypes.bool.isRequired,
  errorMsg: React.PropTypes.string.isRequired,
  checking: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
