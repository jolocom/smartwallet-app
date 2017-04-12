import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:getIdentityInformation',
    'wallet/identity:goToPassportManagement',
    'wallet/identity:goToDrivingLicenceManagement',
    'wallet/identity:goToContactManagement'
  ]
})
export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.object,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
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
        contact={identity.contact}
        webId={identity.webId}
        passport={identity.passport}
        isLoaded={identity.loaded}
        goToContactManagement={this.props.goToContactManagement}
        goToPassportManagement={this.props.goToPassportManagement}
        goToDrivingLicenceManagement={this.props.goToDrivingLicenceManagement}
      />
    )
  }
}
