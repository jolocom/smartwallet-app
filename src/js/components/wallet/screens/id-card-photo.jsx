import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/id-card-photo'

@connect({
  props: ['wallet.idCard'],
  actions: [
    'wallet/id-card:changeIdCardField',
    'wallet/id-card:setShowAddress',
    'wallet/id-card:cancel'
  ]
})

export default class WalletIdCardPhotoScreen extends React.Component {
  static propTypes = {
    idCard: React.PropTypes.object.isRequired,
    changeIdCardField: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      changeIdCardField={this.props.changeIdCardField}
      images={[{imgSrc: '/src/img/slide-data.png'}, {imgSrc: '/src/img/slide-data.png'}, {imgSrc: '/src/img/slide-data.png'}]}
      idCard={this.props.idCard} />
  }
}
