import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/transition'

@connect({
  props: ['verification.transition'],
  actions: [
    'verification/transition:setCurrentStep',
    'verification/transition:startDataCheck',
    'verification/transition:startFaceCheck',
    'verification/transition:requestVerification'
  ]
})
export default class VerificationTransitionScreen extends React.Component {
  static propTypes = {
    setCurrentStep: React.PropTypes.func.isRequired,
    startDataCheck: React.PropTypes.func.isRequired,
    startFaceCheck: React.PropTypes.func.isRequired,
    requestVerification: React.PropTypes.func.isRequired,
    transition: React.PropTypes.object.isRequired
  }

  render() {
    const {
      setCurrentStep,
      startDataCheck,
      startFaceCheck,
      requestVerification,
      transition
    } = this.props
    return (
      <Presentation
        setCurrentStep={setCurrentStep}
        startDataCheck={startDataCheck}
        startFaceCheck={startFaceCheck}
        requestVerification={requestVerification}
        currentStep={transition.currentStep} />
    )
  }
}
