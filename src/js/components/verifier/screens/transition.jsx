import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/transition'

@connect({
  props: ['verifier.transition'],
  actions: [
    'verifier/transition:setCurrentStep',
    'verifier/transition:startDataCheck',
    'verifier/transition:startFaceCheck',
    'verifier/transition:goBack',
    'verifier/transition:requestVerification',
    'verifier/result:startComparingData'
  ]
})
export default class VerificationTransitionScreen extends React.Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    startDataCheck: PropTypes.func.isRequired,
    startFaceCheck: PropTypes.func.isRequired,
    requestVerification: PropTypes.func.isRequired,
    transition: PropTypes.object.isRequired,
    startComparingData: PropTypes.func.isRequired
  }

  render() {
    const {
      startDataCheck,
      startFaceCheck,
      requestVerification,
      goBack,
      startComparingData
    } = this.props
    const {currentStep} = this.props.transition
    return (
      <Presentation
        goBack={() => goBack(currentStep)}
        startDataCheck={startDataCheck}
        startFaceCheck={startFaceCheck}
        requestVerification={(...args) => {
          requestVerification(...args)
          startComparingData()
        }}
        currentStep={currentStep} />
    )
  }
}
