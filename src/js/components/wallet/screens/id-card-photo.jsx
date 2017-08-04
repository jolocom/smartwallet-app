import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/id-card-photo'

@connect({
  props: ['wallet.idCard'],
  actions: [
    'wallet/id-card:storeIdCardPhoto',
    'wallet/id-card:setShowAddress',
    'wallet/id-card:cancel'
  ]
})

export default class WalletIdCardPhotoScreen extends React.Component {
  static propTypes = {
    idCard: React.PropTypes.object.isRequired,
    storeIdCardPhoto: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      changeIdCardField={this.props.storeIdCardPhoto}
      images={this.props.idCard.idCard.images}
      idCard={this.props.idCard} />
  }
}
