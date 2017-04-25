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

import {theme} from 'styles'

import {Container, Header, Block, SideNote, Footer} from '../../structure'

const STYLES = {
  phraseWrapper: {
    lineHeight: '32px',
    padding: '8px'
  },
  phrase: {
    fontSize: '22px',
    fontWeight: '300',
    color: '#942f51',
    backgroundColor: '#fff'
  },
  sideNoteGreen: {
    color: theme.palette.primary1Color
  },
  uncheckedIcon: {
    fill: theme.jolocom.gray1
  },
  checkBox: {
    width: '40%',
    margin: 'auto'
  },
  labelStyle: {
    color: theme.jolocom.gray1,
    fontSize: '13px',
    marginLeft: '5px',
    display: 'inline-block',
    position: 'relative'
  },
  nextStep: {
    flex: 1
  }
}

const WritePhrase = (props) => {
  return (
    <Container>
      <Block>
        <Avatar
          src="/img/img_techguy.svg"
          size={60} />
      </Block>
      <Header title="Your secure phrase" />

      <Block style={STYLES.phraseWrapper}>
        <span style={STYLES.phrase}>{
          props.value || 'The flying red fox is jumping enthusiastically' +
            'over the little brown dog.'
        }</span>
      </Block>
      <Block>
        <SideNote style={STYLES.sideNoteGreen}>
          IMPORTANT <br />
          Write these words down on an analog and secure place. Store it in at
          least two different places. Without these words you cannot access
          your wallet again.
          Anyone with these words can get access to your wallet!
          By the way! Taking a screenshot is not secure!
        </SideNote>
      </Block>
      <Block style={STYLES.checkBox}>
        <Checkbox
          label="Yes, I have securely written down my phrase."
          labelStyle={STYLES.labelStyle}
          checkedIcon={<Checked />}
          uncheckedIcon={<Unchecked style={STYLES.uncheckedIcon} />}
          onClick={(e) => props.onToggle(e.target.checked)}
        />
      </Block>
      <Block style={STYLES.nextStep}>
        <RaisedButton
          label="NEXT STEP"
          secondary
          onClick={props.onSubmit}
          disabled={!props.isChecked} />
      </Block>
      <Block>
        <SideNote>
          Actually, I do not want to be responsible for the storage.
        </SideNote>
      </Block>
      <Footer>
        <FlatButton
          label="STORE IT FOR ME"
          onClick={() => { props.onChange('layman'); props.onSubmit() }} />
      </Footer>
    </Container>
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
