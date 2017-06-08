import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/data'

@connect({
  props: ['verification'],
  actions: []
})
export default class VerificationDataScreen extends React.Component {
  static propTypes = {
  }

  render() {
    return (
      <Presentation />
    )
  }
}
