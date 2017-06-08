import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/transition'

@connect({
  props: ['verification'],
  actions: []
})
export default class VerificationResultScreen extends React.Component {
  static propTypes = {
  }

  render() {
    return (
      <Presentation />
    )
  }
}
