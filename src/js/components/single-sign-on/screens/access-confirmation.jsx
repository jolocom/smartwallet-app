import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/access-confirmation'

@connect({
  props: ['singleSignOn.accessRequest'],
  actions: ['single-sign-on/access-request:redirectToReturnUrl']
})
export default class AccessConfirmationScreen extends React.Component {
  static propTypes = {
    accessRequest: React.PropTypes.obj,
    redirectToReturnUrl: React.PropTypes.func
  }

  render() {
    return (
      <Presentation
        redirectToReturnUrl={this.props.redirectToReturnUrl}
        entity={this.props.accessRequest.entity} />
    )
  }
}
