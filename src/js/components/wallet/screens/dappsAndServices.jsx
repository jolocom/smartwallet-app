import PropTypes from 'prop-types'
import React from 'react'
import Presentation from '../presentation/dappsAndServices'
import { connect } from 'redux_state/utils'

@connect({
  props: ['wallet.interactions'],
  actions: ['wallet/interactions:getClaims']
})
export default class DappsAndServices extends React.PureComponent {
  static propTypes = {
    interactions: PropTypes.object,
    getClaims: PropTypes.func
  }

  componentDidMount() {
    this.props.getClaims()
  }

  render() {
    const interactions = this.props.interactions

    return (
      <Presentation
        selfClaims={interactions.selfSignedClaims}
        thirdPartyClaims={interactions.thirdPartySignedClaims}
      />
    )
  }
}
