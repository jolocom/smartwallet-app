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

    const identity = this.props.wallet.identity
    return (
      <Presentation
        username={identity.username}
        phone={identity.phone[0]}
        webId={identity.webId}
        email={identity.email[0]}
        passport={identity.passport}
        isLoaded={identity.loaded}
        goToContactManagement={this.props.goToContactManagement}
        goToPassportManagement={this.props.goToPassportManagement}
        goToDivingLicenceManagement={this.props.goToDivingLicenceManagement}
      />
    )
  }
}
