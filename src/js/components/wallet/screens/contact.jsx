import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: ['wallet.contact'],
  actions: ['wallet/contact:saveChanges']
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    saveChanges: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      onSubmit={this.props.saveChanges}
    />
  }
}
