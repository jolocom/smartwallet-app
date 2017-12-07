import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/document'

@connect({
  props: ['verifier.document'],
  actions: [
    'verifier/document:chooseDocument'
  ]
})
export default class VerificationDocumentScreen extends React.Component {
  static propTypes = {
    chooseDocument: PropTypes.func.isRequired,
    document: PropTypes.object.isRequired
  }

  render() {
    return (<Presentation
      chooseDocument={this.props.chooseDocument}
      type={this.props.document.type} />)
  }
}
