import React from 'react'
import Radium from 'radium'

import {Checkbox} from 'material-ui'
import Unchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked'
import Checked from 'material-ui/svg-icons/action/check-circle'

import {EditAppBar} from './ui'
import {Block, Header} from '../../structure'

const STYLES = {
  title: {
    fontSize: '24px',
    fontWeight: '400',
    margin: 0,
    textAlign: 'center'
  },
  checkBox: {
    margin: 'auto'
  },
  text: {
    textAlign: 'center',
    fontWeight: '200',
    fontSize: '26px',
    maxWidth: '360px',
    margin: 'auto'
  },
  imageField: {
    flex: 1,
    width: '320px',
    height: '320px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/img_onboarding-03.svg)'
  }
}

@Radium
export default class VerificationFacePresentation extends React.Component {
  static propTypes = {
    verify: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    confirmMatch: React.PropTypes.func.isRequired
  }

  render() {
    const {verify, cancel, confirmMatch} = this.props
    return (<Block>
      <EditAppBar
        title="Face Check"
        onSave={verify}
        onClose={cancel} />
      <Header style={STYLES.title}> STEP 1</ Header>
      <div style={STYLES.text}>
        Please check if the person in front of you is the same person as
        on the picture of the ID Card
      </div>
      <div style={STYLES.imageField}>
      </div>
      <Checkbox
        label="Yes, This person in front of me is the one of the ID Card"
        style={STYLES.text}
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked style={STYLES.uncheckedIcon} />}
        onClick={confirmMatch} />
    </ Block>)
  }
}
