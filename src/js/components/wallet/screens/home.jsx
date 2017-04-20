import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/home'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:goToIdentity'
  ]
})
export default class WalletHomeScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.any,
    goToIdentity: React.PropTypes.func.isRequired
  }

  render() {
    return (<Presentation
      onClick={this.props.goToIdentity} />)
  }
}
