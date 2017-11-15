import React from 'react'
import { connect } from 'redux_state/utils'
import Presentation from '../presentation/phrase-info'

@connect({
  props: ['registration'],
  actions: ['registration:goForward',
    'registration:setUserType',
    'registration:setPassphraseWrittenDown']
})
export default class RegistrationPhraseInfoScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    setUserType: React.PropTypes.func.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setPassphraseWrittenDown: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      onChange={this._handleChange}
      onSubmit={this._handleSubmit} />
  }
  _handleChange = () => {
    this.props.setUserType('expert')
    this.props.setPassphraseWrittenDown(false)
    this.props.goForward()
  }
  _handleSubmit = () => {
    this.props.setPassphraseWrittenDown(true)
    this.props.goForward()
  }
}
