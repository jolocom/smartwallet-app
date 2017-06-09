import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/face'

@connect({
  props: ['verification'],
  actions: [
    'verification/face:verifyFace',
    'verification/face:cancelFaceVerification',
    'verification/face:confirmFaceIdCardMatch'
  ]
})
export default class VerificationFaceScreen extends React.Component {
  static propTypes = {
  }

  render() {
    return (
      <Presentation
        verify={() => {}}
        cancel={() => {}}
        confirmMatch={() => {}} />
    )
  }
}
