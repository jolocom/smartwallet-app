import PropTypes from 'prop-types'
import React from 'react'
import Presentation from '../presentation/dappsAndServices'
import { connect } from 'redux_state/utils'

@connect({
  props: ['wallet.interactions',
    'wallet.identityNew'],
  actions: ['wallet/interactions:getClaims']
})
export default class DappsAndServices extends React.PureComponent {
  static propTypes = {
    interactions: PropTypes.object,
    identityNew: PropTypes.object,
    getClaims: PropTypes.func
  }

  componentDidMount() {
    if (!this.props.identityNew.appStarted) {
      this.props.getClaims()
    }
  }

  render() {
    return (
      <Presentation
        interactions={this.props.interactions} />
    )
  }
}
