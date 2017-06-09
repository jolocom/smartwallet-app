import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'

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
    margin: 'auto',
    color: theme.jolocom.grey1
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
  },
  checkedIcon: {
    fill: '#ffb049'
  }
}

@Radium
export default class VerificationResultPresentation extends React.Component {
  static propTypes = {
  }

  render() {
    return (<Block>
      <EditAppBar
        title="Compare Data"
        onSave={'verify'}
        onClose={'cancel'} />
      <Header style={STYLES.title}> STEP 3</ Header>
      <div style={STYLES.text}>
        We compare the data with the one saved by the client. This may take a
         'while'
      </div>
      <div style={STYLES.imageField}>
      </div>
    </ Block>)
  }
}
