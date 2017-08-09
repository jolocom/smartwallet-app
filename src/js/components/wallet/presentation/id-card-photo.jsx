import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import { NavigationCancel, ImageLandscape } from 'material-ui/svg-icons'

import {
  EditAppBar, WebcamCapture
} from './ui'
import { Content } from '../../structure'

const STYLES = {
  verificationBlock: {
    backgroundColor: theme.palette.textColor,
    fontSize: '24px'
  },
  verificationMsgHeader: {
    backgroundColor: theme.palette.textColor
  },
  explanText: {
    fontSize: '14pt',
    lineHeight: '16pt',
    fontWeight: '300',
    backgroundColor: theme.jolocom.gray2
  },
  flatBtn: {
    backgroundColor: theme.palette.accent1Color,
    marginLeft: '-16px'
  },
  uploadContainer: {
    height: '64px',
    backgroundColor: theme.jolocom.gray2,
    textAlign: 'left'
  },
  uploadBtn: {
    margin: '10px'
  },
  imageField: {
    height: '60px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  verifierLocationsMsg: {
    width: '100%',
    textAlign: 'center'
  },
  deleteButton: {
    position: 'relative',
    top: '-32px',
    right: '8px'
  },
  imagesContainer: {
    position: 'relative',
    marginLeft: '4px',
    top: '12px',
    width: '80px',
    height: '46px'
  },
  uploadButton: {
    position: 'relative',
    top: '-46px',
    left: '35%',
    width: '32px',
    height: '34px',
    backgroundColor: theme.palette.textColor,
    borderRadius: '3'
  },
  inputField: {
    opacity: '0',
    width: '32px',
    height: '34px',
    position: 'relative',
    top: '-30px'
  },
  image: {
    width: '76px',
    height: '42'
  }
}

@Radium
export default class WalletIdCardPhoto extends React.Component {
  static propTypes = {
    changeIdCardField: React.PropTypes.func,
    images: React.PropTypes.array
  }

  loadImage(event) {
    let file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.props.changeIdCardField(
        reader.result,
        this.props.images.length
      )
    }
    file = null
  }

  render() {
    return (<div style={{textAlign: 'center'}}>
      <EditAppBar
        title=""
        rightTitle="DONE"
        loading={false}
        onSave={() => {}}
        onClose={() => {}} />
      <Content>
        <div style={STYLES.uploadContainer}>
        {
          this.props.images.map((value, index) =>
            <span style={STYLES.imagesContainer}>
              <img style={STYLES.image} src={value} />
              <NavigationCancel
                style={STYLES.deleteButton}
                onClick={(value) => this.props.changeIdCardField('', index)} />
            </span>)
        }
        </div>
        <WebcamCapture storeImageSrcInTheState={(value) =>
          this.props.changeIdCardField(value, this.props.images.length)
        } />
        <div style={STYLES.uploadButton}>
          <ImageLandscape style={{
            color: 'white',
            position: 'relative',
            bottom: '-8px'
          }} />
          <input type="file"
            style={STYLES.inputField}
            onChange={(event) => { this.loadImage(event) }}
            onClick={(event) => { event.target.value = null }} />
        </div>
      </Content>
    </div>)
  }
}
