import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'

@connect({
  props:  ['wallet'],
  actions: [
  'wallet/identity:getIdentityInformation',
  'wallet/identity:goToPassportManagement',
  'wallet/identity:goToDivingLicenceManagement',
  'wallet/identity:goToContactManagement'
]
})
export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.object,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDivingLicenceManagement: React.PropTypes.func.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    getIdentityInformation: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.getIdentityInformation()
  }

  render() {
    return (<div>
      Identity<br />
      {/* <Link to="/wallet/identity/contact"></Link> */}
      <a onClick={ this.props.goToContactManagement }> name : {this.props.wallet.identity.username.value}</a>
    </div>)
  }
}
