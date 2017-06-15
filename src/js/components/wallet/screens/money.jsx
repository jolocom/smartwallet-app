import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/money'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/money:goToEtherManagement'
  ]
})
export default class WalletMoneyScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    goToEtherManagement: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <Presentation
        goToEtherManagement={this.props.goToEtherManagement}
      />
    )
  }
}
