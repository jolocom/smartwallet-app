import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/home'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:goTo',
    'wallet/identity:getIdentityInformation'
  ]
})
export default class WalletHomeScreen extends React.Component {
  static propTypes = {
    goTo: PropTypes.func.isRequired
  }

  render() {
    return (<Presentation
      onClick={() => { this.props.goTo('identity') }} />)
  }
}
