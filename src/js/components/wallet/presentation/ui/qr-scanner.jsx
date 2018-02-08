import React from 'react'
import QrReader from 'react-qr-reader'

export default class QRScanner extends React.Component {

  handleScan(result) {
    if (result) {
      console.log('RESULT CAM: ', result)
    }
  }

  handleError(err) {
    console.error(err)
  }

  render() {
    const delay = 500
    const previewStyle = {
      height: '50%',
      width: '100%'
    }

    return (
      <div>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan} />
      </div>
    )
  }
}
