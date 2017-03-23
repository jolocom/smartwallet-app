import React from 'react'
import Radium from 'radium'

import {
  Checkbox,
  RaisedButton,
  FlatButton,
  Avatar
} from 'material-ui'
import Unchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import Checked from 'material-ui/svg-icons/action/check-circle'
import registrationStyles from '../styles'
import theme from '../../../styles/jolocom-theme'

const STYLES = {
  root: registrationStyles,
  phraseWrapper: Object.assign({}, registrationStyles.elementSpacing, {
    lineHeight: '32px',
    padding: '8px'
  }),
  phrase: {
    fontSize: '22px',
    fontWeight: '300',
    color: '#942f51',
    backgroundColor: '#fff'
  },
  sideNoteGreen: {
    fontSize: '13px',
    fontWeight: '300',
    color: theme.palette.primary1Color
  },
  uncheckedIcon: {
    fill: theme.jolocom.gray1
  },
  confirm: {
    margin: '8px 0',
    width: '100%'
  }
}

const WritePhrase = (props) => {
  return (
    <div style={STYLES.root.container}>
      <div style={STYLES.root.elementSpacing}>
        <Avatar
          src="/img/img_techguy.svg"
          size={60} />
      </div>
      <div style={STYLES.root.elementSpacing}>
        <h1 style={{...STYLES.root.header,
          ...STYLES.root.elementSpacing}}>
          Your secure phrase
        </h1>
      </div>
      <div style={STYLES.phraseWrapper}>
        <span style={STYLES.phrase}>{
          props.value || 'The flying red fox is jumping enthusiastically' +
            'over the little brown dog.'
        }</span>
      </div>
      <div style={STYLES.root.elementSpacing}>
        <p style={STYLES.sideNoteGreen}>
          IMPORTANT <br />
          Write these words down on an analog and secure place. Store it in at
          least two different places. Without these words you cannot access your
          wallet again. Anyone with these words can get access to your wallet!
          By the way! Taking a screenshot is not secure!
        </p>
      </div>
      <div style={STYLES.confirm}>
        <Checkbox
          label="Yes, I have securely written down my phrase."
          labelStyle={STYLES.root.sideNoteGray}
          checkedIcon={<Checked />}
          uncheckedIcon={<Unchecked style={STYLES.uncheckedIcon} />}
          onClick={(e) => props.onToggle(e.target.checked)}
        />
      </div>
      <div style={Object.assign({flex: 1}, STYLES.root.elementSpacing)}>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit}
          disabled={!props.isChecked} />
      </div>
      <div style={STYLES.root.elementSpacing}>
        <p style={STYLES.root.sideNoteGray}>
          Actually, I do not want to be responsible for the storage.
        </p>
      </div>
      <div style={STYLES.root.elementSpacing}>
        <FlatButton
          label="STORE IT FOR ME"
          onClick={() => { props.onChange('layman'); props.onSubmit() }} />
      </div>
    </div>
  )
}

WritePhrase.propTypes = {
  onToggle: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  isChecked: React.PropTypes.bool.isRequired
}

export default Radium(WritePhrase)
