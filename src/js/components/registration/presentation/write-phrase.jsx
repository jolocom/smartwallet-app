import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'

import Unchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import Checked from 'material-ui/svg-icons/action/check-circle'

import {theme} from 'styles'

import {Container, Header, Block, SideNote} from '../../structure'

const STYLES = {
  phraseWrapper: {
    lineHeight: '28px',
    padding: '8px'
  },
  phrase: {
    color: theme.textStyles.sectionheader.color,
    fontWeight: '100',
    fontSize: theme.textStyles.sectionheader.fontSize,
    backgroundColor: '#fff'
  },
  sideNoteGreen: {
    color: theme.palette.primary1Color,
    textSize: theme.textStyles.textCopy.fontSize,
    lineHeight: '1.5em',
    marginLeft: '24px',
    marginRight: '24px',
    '@media screen and (min-width: 700px)': {
      marginLeft: '100px',
      marginRight: '100px'
    }
  },
  uncheckedIcon: {
    fill: theme.jolocom.gray1
  },
  checkBox: {
    margin: 'auto',
    '@media screen and (min-width: 350px)': {
      width: '317px'
    }
  },
  labelStyle: {
    color: theme.textStyles.textCopy.color,
    fontSize: theme.textStyles.textCopy.fontSize,
    fontWeight: theme.textStyles.textCopy.fontWeight,
    display: 'inline-block',
    position: 'relative',
    textAlign: 'left'
  },
  nextStep: {
    flex: 1
  },
  embeddedLink: {
    color: theme.palette.accent1Color
  },
  avatar: {
    marginBottom: '18px'
  }
}

const WritePhrase = (props) => {
  return (
    <Container>
      <Block>
        <Header image={
          <Avatar
            style={STYLES.avatar}
            src="/img/img_techguy.svg"
            size={60} />}
          title="Your secure phrase" />
      </Block>

      <Block style={STYLES.phraseWrapper}>
        <span style={STYLES.phrase}>{
          props.value || 'The flying red fox is jumping enthusiastically' +
            ' over the little brown dog.'
        }</span>
      </Block>
      <Block>
        <SideNote style={STYLES.sideNoteGreen}>
          IMPORTANT <br />
          Write these words down on an analog and secure place. Store it in at
          least two different places. Without these words you cannot access
          your wallet again.
          Anyone with these words can get access to your wallet.
          Taking a screenshot is not secure.
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
    </Container>
  )
}

WritePhrase.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired
}

export default Radium(WritePhrase)
