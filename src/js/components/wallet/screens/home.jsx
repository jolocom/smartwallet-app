import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/home'

@connect({
  props: []
})
export default class WalletHomeScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (<Presentation />)
  }
}
