import PropTypes from 'prop-types'
import React from 'react'
import Presentation from '../presentation/dappsAndServices'
import { connect } from 'redux_state/utils'

@connect({
  props: [],
  actions: ['wallet/tabs:getClaims']
})
export default class DappsAndServices extends React.Component {
  static propTypes = {
    getClaims: PropTypes.func
  }

  render() {
    console.log('DAPPSANDSER =========')
    const selfClaims = this.props.getClaims().selfSigned
    const thirdPartyClaims = this.props.getClaims().thirdPartySigned

    return (
      <Presentation
        selfClaims={selfClaims}
        thirdPartyClaims={thirdPartyClaims}
      />
    )
  }
}
