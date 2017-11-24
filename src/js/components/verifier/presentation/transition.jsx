import React from 'react'
import Radium from 'radium'
import FlatButton from 'material-ui/FlatButton'
import AppBar from 'material-ui/AppBar'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

import {theme} from 'styles'
import {Header} from '../../structure'

const STYLES = {
  imageField: {
    flex: 1,
    width: '50px',
    height: '50px',
    paddingTop: '20px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/ic_checkmark_grey.svg)'
  },
  faceCheckImage: {
    flex: 1,
    width: '80px',
    height: '80px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  dataCheckImage: {
    flex: 1,
    width: '80px',
    height: '80px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/img_datacheck_02.svg)'
  },
  icon: {
    color: 'white',
    margin: '12px'
  },
  yellow: {
    backgroundColor: '#fed546'
  },
  grey: {
    backgroundColor: '#d7d6d6'
  }
}

@Radium
export default class VerificationTransitionPresentation extends React.Component { // eslint-disable-line max-len
  static propTypes = {
    startDataCheck: React.PropTypes.func.isRequired,
    startFaceCheck: React.PropTypes.func.isRequired,
    requestVerification: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired
  }

  render() {
    const {
      currentStep,
      startDataCheck,
      startFaceCheck,
      requestVerification,
      goBack
    } = this.props
    const faceCheck = currentStep === 'face'
      ? <FlatButton
        label="START FACE CHECK"
        onClick={startFaceCheck}
        labelStyle={{color: 'white', margin: '10px'}}
        style={STYLES.yellow} />
      : <header
        style={{margin: '10px', color: theme.jolocom.gray1}}>
        DONE
      </ header>

    const dataCheck = ((currentStep) => {
      switch (currentStep) {
        case 'compare':
          return <header
            onClick={startDataCheck}
            style={{color: STYLES.yellow.backgroundColor, margin: '10px'}}>
            EDIT DATA
          </ header>
        default:
          return <FlatButton
            label="START DATA CHECK"
            onClick={startDataCheck}
            disabled={currentStep !== 'data'}
            labelStyle={{color: 'white', margin: '10px'}}
            style={currentStep === 'face' ? STYLES.grey : STYLES.yellow} />
      }
    })(currentStep)
    const backgroundImage = (currentStep === 'face')
      ? 'url(img/img_datacheck_01.svg)' : 'url(img/img_datacheck_03.svg)'

    return (<div style={{textAlign: 'center'}} >
      <AppBar
        iconElementLeft={<NavigationArrowBack
          onClick={() => { goBack(currentStep) }}
          style={STYLES.icon} />}
        title="verifier"
        style={{textAlign: 'left', ...STYLES.yellow}}
        titleStyle={{color: 'white'}} />
      <Header title="Please verify the data of the ID Card" />
      <div style={{...STYLES.faceCheckImage, backgroundImage}} />
      <header style={{color: 'black', margin: '10px'}}>
        STEP 1: FACE CHECK
      </ header>
      {faceCheck}
      <div style={STYLES.dataCheckImage} />
      <header style={{color: 'black', margin: '10px'}}>
        STEP 2: DATA CHECK
      </ header>
      {dataCheck}
      <div style={STYLES.imageField} />
      <header style={{color: 'black', margin: '10px'}}>
        STEP 3: COMPARE DATA
      </ header>
      <FlatButton
        label="COMPARE DATA"
        onClick={requestVerification}
        disabled={currentStep !== 'compare'}
        labelStyle={{color: 'white', margin: '10px'}}
        style={currentStep === 'compare' ? STYLES.yellow : STYLES.grey} />
    </ div>)
  }
}
