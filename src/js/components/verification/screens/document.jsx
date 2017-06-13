import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/document'

@connect({
  props: ['verification.document'],
  actions: [
    'verification/document:chooseDocument'
  ]
})
export default class VerificationDocumentScreen extends React.Component {
  static propTypes = {
    chooseDocument: React.PropTypes.func.isRequired,
    document: React.PropTypes.object.isRequired
  }

  render() {
    return (<Presentation
      chooseDocument={this.props.chooseDocument}
      type={this.props.document.type} />)
  }
}
