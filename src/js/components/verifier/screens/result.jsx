import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/result'

@connect({
  props: ['verifier.result'],
  actions: [
    'verifier/result:finishVerification',
    'verifier/result:startDataCheck'
  ]
})
export default class VerificationResultScreen extends React.Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    finishVerification: PropTypes.func.isRequired,
    startDataCheck: PropTypes.func.isRequired
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
