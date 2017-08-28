import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/home'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:goTo',
    'wallet/identity:getIdentityInformation'
  ]
})
export default class WalletHomeScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.any,
    goTo: React.PropTypes.func.isRequired,
    getIdentityInformation: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getIdentityInformation()
  }

  render() {
    return (<Presentation
      onClick={() => { this.props.goTo('identity') }}
      username={this.props.wallet.identity.username.value} />)
  }
}
