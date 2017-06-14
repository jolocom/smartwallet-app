import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/transition'

@connect({
  props: ['verification.transition'],
  actions: [
    'verification/transition:setCurrentStep',
    'verification/transition:startDataCheck',
    'verification/transition:startFaceCheck',
    'verification/transition:goBack',
    'verification/transition:requestVerification'
  ]
})
export default class VerificationTransitionScreen extends React.Component {
  static propTypes = {
    goBack: React.PropTypes.func.isRequired,
    startDataCheck: React.PropTypes.func.isRequired,
    startFaceCheck: React.PropTypes.func.isRequired,
    requestVerification: React.PropTypes.func.isRequired,
    transition: React.PropTypes.object.isRequired
  }

  render() {
    const {
      startDataCheck,
      startFaceCheck,
      requestVerification,
      goBack
    } = this.props
    const {currentStep} = this.props.transition
    return (
      <Presentation
        goBack={() => goBack(currentStep)}
        startDataCheck={startDataCheck}
        startFaceCheck={startFaceCheck}
        requestVerification={requestVerification}
        currentStep={currentStep} />
    )
  }
}
