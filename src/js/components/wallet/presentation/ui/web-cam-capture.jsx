import React from 'react'
import Radium from 'radium'
import Webcam from 'react-webcam'
import { FloatingActionButton } from 'material-ui'
import Camera from 'material-ui/svg-icons/image/camera-alt'

@Radium
export default class WebcamCapture extends React.Component {
  static propTypes = {
    storeImageSrcInTheState: React.PropTypes.func
  }
  setRef(webcam) {
    this.webcam = webcam
  }

  capture() {
    const imageSrc = this.webcam.getScreenshot()
    this.props.storeImageSrcInTheState(imageSrc)
  }

  render() {
    return (<div style={{textAlign: 'center'}}>
      <Webcam
        audio={false}
        ref={(ref) => this.setRef(ref)}
        screenshotFormat="image/jpeg"
        width={'100%'}
        height={'100%'}
        style={{maxWidth: '647.1px'}} /> <br />
      <FloatingActionButton secondary onClick={() => { this.capture() }}>
        <Camera />
      </FloatingActionButton>
    </div>)
  }
}
