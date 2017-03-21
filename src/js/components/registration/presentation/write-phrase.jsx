import React from 'react'
import Radium from 'radium'

import {
  Checkbox,
  RaisedButton,
  Avatar
} from 'material-ui'
import Unchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import Checked from 'material-ui/svg-icons/action/check-circle'

const STYLES = {
  container: {
    backgroundColor: '#f8f9fb',
    height: '100vh',
    textAlign: 'center'
  },
  heading: {
    fontSize: '18pt',
    fontWeight: '300',
    color: '#939393',
    margin: '20px'
  },
  phrase: {
    fontSize: '18pt',
    fontWeight: '300',
    margin: '20px',
    color: '#942f51',
    lineHeight: '25pt',
    backgroundColor: '#fff',
    padding: '10px'
  },
  sidenote: {
    fontSize: '11pt',
    fontWeight: '300',
    color: '#b3c90f',
    margin: '20px'
  },
  confirmCheck: {
    margin: '20px'
  },
  confirmCheckLabel: {
    fontSize: '11pt',
    fontWeight: '300',
    color: '#939393'
  },
  uncheckedIcon: {
    fill: '#939393'
  },
  avatar: {
    marginTop: '20px'
  }
}

const WritePhrase = (props) => {
  return (
    <div style={STYLES.container}>
      <Avatar
        src="/img/img_techguy.svg"
        size={60}
        style={STYLES.avatar} />
      <h1 style={STYLES.heading}>Your secure phrase</h1>
      <p style={STYLES.phrase}>
        {
          props.value || 'The flying red fox is jumping enthusiastically over\
          the little brown dog.'
        }
      </p>
      <p style={STYLES.sidenote}>
        IMPORTANT <br />
        Write these words down on an analog and secure place. Store it in at
        least two different places. Without these words you cannot access your
        wallet again. Anyone with these words can get access to your wallet!
        By the way! Taking a screenshot is not secure!
      </p>
      <div style={STYLES.confirmCheck}>
        <Checkbox
          label="Yes, I have securely written down my phrase."
          labelStyle={STYLES.confirmCheckLabel}
          checkedIcon={<Checked />}
          uncheckedIcon={<Unchecked style={STYLES.uncheckedIcon} />}
          onClick={(e) => props.onToggle(e.target.checked)}
        />
      </div>
      <RaisedButton
        label="NEXT STEP"
        secondary
        onClick={props.onSubmit} />
    </div>
  )
}

WritePhrase.propTypes = {
  onToggle: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
}

export default Radium(WritePhrase)
