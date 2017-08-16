import React from 'react'
import {connect} from 'redux/utils'
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
    verifyFace: React.PropTypes.func.isRequired,
    cancelFaceVerification: React.PropTypes.func.isRequired,
    confirmFaceIdCardMatch: React.PropTypes.func.isRequired,
    face: React.PropTypes.object.isRequired
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
