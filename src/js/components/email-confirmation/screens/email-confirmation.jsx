import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/email-confirmation'
import queryString from 'query-string'

@connect({
  props: ['emailConfirmation'],
  actions: [
    'login:goToLogin',
    'email-confirmation:confirm'
  ]
})
export default class EmailConfirmationScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    emailConfirmation: React.PropTypes.object.isRequired,
    goToLogin: React.PropTypes.func.isRequired,
    confirm: React.PropTypes.func.isRequired
  }
  componentWillMount() {
    let url = window.location.toString()
    let urlparams = queryString.parse(url.slice(url.search('\\?')))
    this.props.confirm(urlparams.a)
  }

  render() {
    return (<Presentation
      onClick={this.props.goToLogin}
      confirmation={this.props.emailConfirmation.success}
      loading={this.props.emailConfirmation.loading} />)
  }
}
