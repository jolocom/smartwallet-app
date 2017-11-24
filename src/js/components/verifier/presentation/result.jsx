import React from 'react'
import Radium from 'radium'

import FlatButton from 'material-ui/FlatButton'
import AppBar from 'material-ui/AppBar'

import {theme} from 'styles'

import {EditAppBar} from './ui'
import {Header} from '../../structure'

const STYLES = {
  title: {
    fontSize: '24px',
    fontWeight: '400',
    margin: '12px',
    textAlign: 'center'
  },
  appBarTitle: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'center',
    fontWeight: '200',
    fontSize: '26px',
    paddingTop: '10px',
    margin: 'auto',
    maxWidth: '360px',
    color: theme.jolocom.grey1
  },
  successImage: {
    flex: 1,
    width: '320px',
    height: '300px',
    margin: 'auto',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/img_verification_3rdparty_successful.svg)'
  },
  failedImage: {
    flex: 1,
    width: '320px',
    height: '300px',
    margin: 'auto',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/img_verification_3rdparty_failed.svg)'
  },
  loadingImage: {
    flex: 1,
    width: '320px',
    height: '320px',
    margin: 'auto',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/img_datacheck_loading.svg)'
  },
  buttonLabel: {
    color: 'white',
    textAlign: 'center',
    margin: 'auto'
  },
  button: {
    backgroundColor: '#fda72c',
    marginTop: '40px',
    margin: '12px',
    textAlign: 'center'
  },
  result: {
    textAlign: 'center'
  }
}

@Radium
export default class VerificationResultPresentation extends React.Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    success: React.PropTypes.bool.isRequired,
    numberOfFails: React.PropTypes.number.isRequired,
    startDataCheck: React.PropTypes.func.isRequired,
    finishVerification: React.PropTypes.func.isRequired
  }

  render() {
    const {
      loading,
      success,
      numberOfFails,
      startDataCheck,
      finishVerification
    } = this.props
    if (loading) {
      return (<div>
        <EditAppBar
          title="Compare Data"
          onClose={finishVerification} />
        <Header style={STYLES.title}> STEP 3</ Header>
        <div style={STYLES.text}>
          We compare the data with the one saved by the client.
        This may take a while
        </div>
        <div style={STYLES.loadingImage}></div>
      </ div>)
    }
    let result = null
    if (success) {
      result = (<div style={STYLES.result}>
        <div style={STYLES.text}>
          The data has been verified successfully!
        </div>
        <div style={STYLES.successImage}></div>
        <div style={STYLES.text}>
          Thank you for taking the time to verify the data.
        </div>
        <FlatButton
          label="DONE"
          onClick={finishVerification}
          labelStyle={STYLES.buttonLabel}
          style={STYLES.button} />
      </div>)
    } else if (numberOfFails === 1) {
      result = (<div style={STYLES.result}>
        <div style={STYLES.text}>
          The data has not been verified. Please check the data you filled in
          another time.
        </div>
        <div style={STYLES.failedImage}></div>
        <FlatButton
          label="CHECK DATA"
          onClick={startDataCheck}
          labelStyle={STYLES.buttonLabel}
          style={STYLES.button} />
      </div>)
    } else {
      result = (<div style={STYLES.result}>
        <div style={STYLES.text}>
          The data has not been verified. Please ask the client to check the
          data you on his/her side.
        </div>
        <div style={STYLES.failedImage}></div>
        <FlatButton
          label="CHECK DATA"
          onClick={startDataCheck}
          labelStyle={STYLES.buttonLabel}
          style={STYLES.button} />
      </div>)
    }
    return (<div>
      <AppBar
        iconElementLeft={<div />}
        title="verifier"
        style={STYLES.appBarTitle} />
        {result}
    </ div>)
  }
}
