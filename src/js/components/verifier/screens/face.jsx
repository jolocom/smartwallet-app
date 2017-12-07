import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/face'

@connect({
  props: ['verifier.face'],
  actions: [
    'verifier/face:verifyFace',
    'verifier/face:cancelFaceVerification',
    'verifier/face:confirmFaceIdCardMatch'
  ]
})
export default class VerificationFaceScreen extends React.Component {
  static propTypes = {
    verifyFace: PropTypes.func.isRequired,
    cancelFaceVerification: PropTypes.func.isRequired,
    confirmFaceIdCardMatch: PropTypes.func.isRequired,
    face: PropTypes.object.isRequired
  }

  render() {
    const {verifyFace, cancelFaceVerification, confirmFaceIdCardMatch} = this.props // eslint-disable-line max-len
    const {isFaceMatchingId} = this.props.face
    return (<Presentation
      verify={verifyFace}
      cancel={cancelFaceVerification}
      confirmMatch={confirmFaceIdCardMatch}
      isFaceMatchingId={isFaceMatchingId} />)
  }
}
