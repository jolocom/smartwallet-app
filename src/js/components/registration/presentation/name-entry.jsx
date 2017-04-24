import React from 'react'
import Radium from 'radium'

import TextField from 'material-ui/TextField'
import {RaisedButton, FlatButton} from 'material-ui'

import {Container, Header, Content, Footer, SideNote} from '../../structure'
import {theme} from 'styles'

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
  embeddedButton: {
    color: '#942f51',
    minWidth: '0px',
    paddingLeft: '5px',
    paddingRight: '5px'
  },
  dialog: {
    textAlign: 'center'
  },
  backgroundColor: theme.jolocom.gray4
}

const NameEntry = (props) => {
  var webIdmessage = (
    <div style={STYLES.dialog}> Your WebID is your identity on the web.
      <br />
      It is the link to your secured personal data and the
      verifications of it that are stored on the blockchain
    </div>)
  return (
    <Container>
      <Header title="Let's get started! Please type in a username." />
      <Content>
        <SideNote>
          It needs to be unique, but choose wisely,
          <br />
          It will be part of your
          <FlatButton style={STYLES.embeddedButton}
            hoverColor={STYLES.backgroundColor}
            onClick={() => {
              props.handleDialog(webIdmessage)
            }}> WebID </FlatButton>
          and it might<br />
          end up on your buiseness card one day.
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
      </Content>
      <Footer>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit}
          disabled={false}
        />
      </Footer>
    </Container>
  )
}

NameEntry.propTypes = {
  value: React.PropTypes.string.isRequired,
  valid: React.PropTypes.bool.isRequired,
  errorMsg: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  handleDialog: React.PropTypes.func.isRequired
}

export default Radium(NameEntry)
