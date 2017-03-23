import React from 'react'
import Radium from 'radium'

import {
  RaisedButton,
  FlatButton,
  Avatar
} from 'material-ui'

const STYLES = {
  container: {
    backgroundColor: '#f8f9fb',
    textAlign: 'center',
    padding: '5%',
    height: '100vh'
  },
  heading: {
    fontSize: '18pt',
    fontWeight: '300',
    color: '#939393',
    margin: '20px 0'
  },
  sideNoteGray: {
    fontSize: '11pt',
    fontWeight: '300',
    color: '#939393'
  },
  nextBtn: {
    margin: '20px 0'
  },
  optionBtn: {
    margin: '20px 0'
  },
  switchMode: {
    marginTop: '20px'
  }
}

const PhraseInfo = (props) => {
  return (
    <div style={STYLES.container}>
      <Avatar
        src="/img/img_nohustle.svg"
        size={60} />
      <h1 style={STYLES.heading}>
        We created a secure phrase for you with which you can access your wallet
        again.
      </h1>
      <p style={STYLES.sideNoteGray}>
        Since you decided for the no hassle mode, we will store it for you. this
        way you can recover it through your E-Mail.
      </p>
      <RaisedButton
        label="AlRIGHT"
        secondary
        style={STYLES.nextBtn}
        onClick={props.onSubmit} />
      <div style={STYLES.switchMode}>
        <Avatar
          src="/img/img_techguy.svg"
          size={60} />
        <br /><br />
        <p style={STYLES.sideNoteGray}>
          Actually, I do want to store it manually myself.
        </p>
        <FlatButton
          label="SHOW SECURE PHRASE"
          style={STYLES.optionBtn} />
      </div>
    </div>
  )
}

PhraseInfo.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(PhraseInfo)
