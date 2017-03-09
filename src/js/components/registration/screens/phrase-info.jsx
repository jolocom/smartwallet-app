import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'
import Presentation from '../presentation/phrase-info'

@connect({
  props: ['registration'],
  actions: ['registration:goForward']
})
@Radium
export default class RegistrationPhraseInfoScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      onSubmit={this.props.goForward}
    />
  }
}
