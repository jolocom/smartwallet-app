import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/email-confirmation'

@connect({
  props: ['verification'],
  actions: [
    'verification:confirmEmail',
    'verification:goToAfterConfirmEmail'
  ]
})
export default class EmailConfirmationScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object.isRequired,
    verification: React.PropTypes.object.isRequired,
    goToAfterConfirmEmail: React.PropTypes.func.isRequired,
    confirmEmail: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.confirmEmail({
      email: this.props.location.query.email,
      id: this.props.location.query.id,
      code: this.props.location.query.code
    })
  }

  render() {
    return (<Presentation
      goToAfterConfirmEmail={this.props.goToAfterConfirmEmail}
      confirmation={this.props.verification.success}
      loading={this.props.verification.loading} />)
  }
}
