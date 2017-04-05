import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'

@connect({
  props: []
})
export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <Presentation />
    )
  }
}
