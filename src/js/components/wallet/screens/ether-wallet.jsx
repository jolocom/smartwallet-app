import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/ether-wallet'

@connect({
  props: []
})
export default class WalletEtherScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <Presentation />
    )
  }
}
