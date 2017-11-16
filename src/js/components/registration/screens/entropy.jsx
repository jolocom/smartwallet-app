import React from 'react'
import { connect } from 'redux_state/utils'
import ImageMaskBuilder from 'lib/image-mask-builder'
import Presentation from '../presentation/entropy'

@connect({
  props: ['registration'],
  actions: [
    'registration:setMaskedImageUncovering',
    'registration:addEntropyFromDeltas',
    'registration:submitEntropy'
  ],
  pure: false
})
export default class RegistrationEntropyScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    submitEntropy: React.PropTypes.func.isRequired,
    addEntropyFromDeltas: React.PropTypes.func.isRequired,
    setMaskedImageUncovering: React.PropTypes.func.isRequired
  }

  constructor() {
    super()

    this.state = {
      count: 0,
      imageMask: new ImageMaskBuilder()
    }
  }

  handleUncoveringChange = (uncovering) => {
    this.props.setMaskedImageUncovering(uncovering)

    if (uncovering) {
      this.state.imageMask.startNewPath()
    } else {
      this.state.imageMask.endPath()
    }
  }

  handleUncoveredPoint = (x, y) => {
    this.state.imageMask.addPoint(x, y)
    this.props.addEntropyFromDeltas({x, y})
    this.setState({count: this.state.count + 1})
  }

  render() {
    return <Presentation
      imageUncoveredPaths={this.state.imageMask.paths}
      imageUncovering={this.props.registration.maskedImage.uncovering}
      valid={this.props.registration.passphrase.sufficientEntropy}
      user={this.props.registration.username.value}
      onImagePointUncoverd={this.handleUncoveredPoint}
      onImageUncoveringChange={this.handleUncoveringChange}
      onMouseMovement={this.handleMouseMovement}
      onSubmit={this.props.submitEntropy}
    />
  }
}
