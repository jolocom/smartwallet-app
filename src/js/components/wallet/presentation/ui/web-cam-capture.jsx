import React from 'react'
import Radium from 'radium'
import Webcam from 'react-webcam'
import { FlatButton } from 'material-ui'
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
        height={205}
        ref={(ref) => this.setRef(ref)}
        screenshotFormat="image/jpeg"
        width={340} /> <br />
      <FlatButton onClick={() => this.capture()} icon={<Camera />} />
    </div>)
  }
}
