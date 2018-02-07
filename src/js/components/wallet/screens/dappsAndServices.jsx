import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/dappsAndServices'

// @connect({
//   props: ,
//   actions:
// })
export default class DappsAndServices extends React.Component {
  // static propTypes = {
  // }

  render() {
    return (
      <Presentation />
    )
  }
}
