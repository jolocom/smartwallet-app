import React from 'react'
import Radium from 'radium'

import {AppBar, FlatButton} from 'material-ui'
import {theme} from 'styles'

import {Header} from '../../structure'

const STYLES = {
  imageField: {
    flex: 1,
    width: '80px',
    height: '80px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/img_onboarding-03.svg)'
  }
}

@Radium
export default class VerificationTransitionPresentation extends React.Component { // eslint-disable-line max-len
  static propTypes = {
    setCurrentStep: React.PropTypes.func.isRequired,
    startDataCheck: React.PropTypes.func.isRequired,
    startFaceCheck: React.PropTypes.func.isRequired,
    requestVerification: React.PropTypes.func.isRequired,
    currentStep: React.PropTypes.string.isRequired
  }

  render() {
    const {
      currentStep,
      startDataCheck,
      startFaceCheck,
      requestVerification
    } = this.props
    const faceCheck = currentStep === 'face'
      ? <FlatButton
        label="START FACE CHECK"
        onClick={startFaceCheck}
        labelStyle={{color: 'white', margin: '10px'}}
        style={{backgroundColor: '#ffb049'}} />
      : <header
        style={{margin: '10px', color: theme.jolocom.gray1}}>
        DONE
      </ header>

    const dataCheck = ((currentStep) => {
      switch (currentStep) {
        case 'compare':
          return <header
            onClick={startDataCheck}
            style={{color: '#ffb049', margin: '10px'}}>
            EDIT DATA
          </ header>
        default:
          return <FlatButton
            label="START DATA CHECK"
            onClick={startDataCheck}
            disabled={currentStep !== 'data'}
            labelStyle={{color: 'white', margin: '10px'}}
            style={currentStep === 'face'
              ? {backgroundColor: theme.jolocom.gray2}
              : {backgroundColor: '#ffb049'}
            } />
      }
    })(currentStep)
    return (<div style={{textAlign: 'center'}} >
      <AppBar
        iconElementLeft={<div />}
        title="verification"
        style={{textAlign: 'left'}} />
      <Header title="Please verify the data of the ID Card" />
      <div style={STYLES.imageField} />
      <header style={{color: 'black', margin: '10px'}}>
        STEP 1: FACE CHECK
      </ header>
      {faceCheck}
      <div style={STYLES.imageField} />
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
        style={currentStep === 'compare'
          ? {backgroundColor: '#ffb049'}
          : {backgroundColor: theme.jolocom.gray2}
        } />
    </ div>)
  }
}
