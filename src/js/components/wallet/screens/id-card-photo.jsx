import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/id-card-photo'

@connect({
  props: ['wallet.idCard'],
  actions: [
    'wallet/id-card:storeIdCardPhoto',
    'wallet/id-card:setShowAddress',
    'wallet/id-card:cancelIdCardPhoto',
    'wallet/id-card:goToIdCardScreen',
    'wallet/id-card:cancel'
  ]
})

export default class WalletIdCardPhotoScreen extends React.Component {
  static propTypes = {
    idCard: React.PropTypes.object.isRequired,
    cancelIdCardPhoto: React.PropTypes.func.isRequired,
    goToIdCardScreen: React.PropTypes.func.isRequired,
    storeIdCardPhoto: React.PropTypes.func.isRequired
  }

  render() {
    const { images } = this.props.idCard.idCard
    const imagesWithDetails = [
      {value: images.frontSideImg.value, field: 'frontSideImg'},
      {value: images.backSideImg.value, field: 'backSideImg'}
    ].filter(({value}) => value !== '')

    return <Presentation
      changeIdCardField={this.props.storeIdCardPhoto}
      save={this.props.goToIdCardScreen}
      deletePhoto={(field) => {
        this.props.storeIdCardPhoto('', field)
      }}
      cancel={this.props.cancelIdCardPhoto}
      images={imagesWithDetails} />
  }
}
