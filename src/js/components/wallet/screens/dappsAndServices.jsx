import PropTypes from 'prop-types'
import React from 'react'
import Presentation from '../presentation/dappsAndServices'
import { connect } from 'redux_state/utils'

@connect({
  props: ['wallet.tabs'],
  actions: ['wallet/tabs:getClaims']
})
export default class DappsAndServices extends React.Component {
  static propTypes = {
    tabs: PropTypes.object,
    getClaims: PropTypes.func
  }

  componentDidMount() {
    this.props.getClaims()
  }

  render() {
    const selfClaims = this.props.tabs.selfSignedClaims
    const thirdPartyClaims = this.props.tabs.thirdPartySignedClaims

    return (
      <Presentation
        selfClaims={selfClaims}
        thirdPartyClaims={thirdPartyClaims}
      />
    )
  }
}
