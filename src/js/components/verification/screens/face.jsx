import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/face'

@connect({
  props: ['verification.face'],
  actions: [
    'verification/face:verifyFace',
    'verification/face:cancelFaceVerification',
    'verification/face:confirmFaceIdCardMatch'
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
    this
    const {
      verifyFace,
      cancelFaceVerification,
      confirmFaceIdCardMatch
    } = this.props
    const {isFaceMatchingId} = this.props.face
    return (
      <Presentation
        verify={verifyFace}
        cancel={cancelFaceVerification}
        confirmMatch={confirmFaceIdCardMatch}
        isFaceMatchingId={isFaceMatchingId} />
    )
  }
}
