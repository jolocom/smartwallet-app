import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/result'

@connect({
  props: ['verification.result'],
  actions: [
    'verification/result:finishVerification',
    'verification/result:startDataCheck '
  ]
})
export default class VerificationResultScreen extends React.Component {
  static propTypes = {
    result: React.PropTypes.object.isRequired,
    finishVerification: React.PropTypes.func.isRequired,
    startDataCheck: React.PropTypes.func.isRequired
  }

  render() {
    const {loading, success, numberOfFails} = this.props.result
    const {startDataCheck, finishVerification} = this.props
    return (<Presentation
      loading={loading}
      success={success}
      numberOfFails={numberOfFails}
      finishVerification={finishVerification}
      startDataCheck={startDataCheck} />
    )
  }
}
