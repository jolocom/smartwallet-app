import React from 'react'
import {connect} from 'redux/utils'

@connect({
  props: [],
  actions: ['ethereum:executeTransaction']
})
export default class EthereumExecuteTransactionScreen extends React.Component {
  static propTypes = {
    location: React.PropTypes.any,
    executeTransaction: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    let params = this.props.location.query['params[]']
    if (typeof params === 'string') {
      params = [params]
    }

    this.props.executeTransaction({
      requester: this.props.location.query.requester,
      contractID: this.props.location.query.contractID,
      method: this.props.location.query.method,
      params: params,
      value: this.props.location.query.value,
      returnURL: this.props.location.query.returnURL
    })
  }

  render() {
    return (
      <div></div>
    )
  }
}
