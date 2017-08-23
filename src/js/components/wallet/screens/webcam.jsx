import React from 'react'
import {connect} from 'redux/utils'

import Presentation from '../presentation/webcam'

@connect({
  props: ['wallet.webCam'],
  actions: [
    'wallet/webcam:addPhoto',
    'wallet/webcam:cancel',
    'wallet/webcam:deletePhoto',
    'wallet/webcam:save'
  ]
})

export default class WebCamScreen extends React.Component {
  static propTypes = {
    addPhoto: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    deletePhoto: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    webCam: React.PropTypes.object.isRequired
  }

  render() {
    return <Presentation
      addPhoto={this.props.addPhoto}
      cancel={this.props.cancel}
      deletePhoto={this.props.deletePhoto}
      photos={this.props.webCam.photos}
      save={this.props.save} />
  }
}
