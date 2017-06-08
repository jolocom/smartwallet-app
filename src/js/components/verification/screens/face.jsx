import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/face'

@connect({
  props: ['verification'],
  actions: []
})
export default class VerificationFaceScreen extends React.Component {
  static propTypes = {
  }

  render() {
    return (
      <Presentation />
    )
  }
}
