import React from 'react'
import Radium from 'radium'

import {
  RaisedButton,
  FlatButton,
  Avatar
} from 'material-ui'

import registrationStyles from '../styles'

const STYLES = {
  root: registrationStyles
}

const PhraseInfo = (props) => {
  return (
    <div style={STYLES.root.container}>
      <div style={STYLES.root.elementSpacing}>
        <Avatar
          src="/img/img_nohustle.svg"
          size={60} />
      </div>
      <div style={STYLES.root.elementSpacing}>
        <h1 style={{...STYLES.root.header,
          ...STYLES.root.elementSpacing}}>
          We created a secure phrase for you with which you can access your
          wallet again.
        </h1>
      </div>
      <div style={STYLES.root.elementSpacing}>
        <p style={STYLES.root.sideNoteGray}>
          Since you decided for the no hassle mode, we will store it for you.
          This way you can recover it through your E-Mail.
        </p>
      </div>
      <div style={STYLES.root.elementSpacing}>
        <RaisedButton
          label="AlRIGHT"
          secondary
          onClick={props.onSubmit} />
      </div>
      <br /><br />
      <div style={STYLES.root.elementSpacing}>
        <Avatar
          src="/img/img_techguy.svg"
          size={60} />
      </div>
      <div style={STYLES.root.elementSpacing}>
        <p style={STYLES.root.sideNoteGray}>
          Actually, I do want to store it manually myself.
        </p>
      </div>
      <div style={STYLES.root.elementSpacing}>
        <FlatButton
          label="SHOW SECURE PHRASE"
          onClick={() => { props.onChange('expert'); props.onSubmit() }} />
      </div>
    </div>
  )
}

PhraseInfo.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Radium(PhraseInfo)
