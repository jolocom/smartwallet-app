import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/access-confirmation'

@connect({
  props: ['wallet.accessRequest']
})
export default class AccessConfirmationScreen extends React.Component {
  static propTypes = {
    accessRequest: React.PropTypes.obj
  }

  render() {
    return (
      <Presentation
        entity={this.props.accessRequest.entity} />
    )
  }
}
