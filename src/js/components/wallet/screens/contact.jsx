import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/contact'

@connect({
  props: []
})
export default class WalletContactScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (<Presentation />)
  }
}
