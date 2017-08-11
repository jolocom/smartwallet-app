import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import { NavigationCancel, ImageLandscape } from 'material-ui/svg-icons'

import {
  EditAppBar, WebcamCapture
} from './ui'
import { Content } from '../../structure'

const STYLES = {
  uploadContainer: {
    backgroundColor: theme.jolocom.gray2,
    textAlign: 'left',
    height: '64px'
  },
  deleteButton: {
    position: 'relative',
    top: '-32px',
    right: '8px'
  },
  imagesContainer: {
    position: 'relative',
    top: '12px',
    marginLeft: '4px',
    width: '80px'
  },
  uploadButton: {
    position: 'relative',
    top: '-46px',
    left: 'calc(45% - 58px)',
    width: '32px',
    height: '34px',
    backgroundColor: theme.palette.textColor,
    borderRadius: '3'
  },
  inputField: {
    opacity: '0',
    width: '100%',
    height: '100%',
    position: 'relative',
    top: '-30px'
  },
  image: {
    width: '76px',
    height: '42px'
  },
  loadButtonIcon: {
    color: 'white',
    position: 'relative',
    bottom: '-8px'
  }
}

const imageKey = (keys) => {
  if (keys === [] || keys.includes('frontSideImg')) {
    return 'backSideImg'
  }
  return 'frontSideImg'
}
@Radium
export default class WalletIdCardPhoto extends React.Component {
  static propTypes = {
    changeIdCardField: React.PropTypes.func,
    cancel: React.PropTypes.func,
    save: React.PropTypes.func,
    deletePhoto: React.PropTypes.func,
    images: React.PropTypes.array
  }

  loadImage(event) {
    let file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.props.changeIdCardField(
        reader.result,
        imageKey(this.props.images.map(({field}) => field))
      )
    }
  }

  render() {
    return (<div style={{textAlign: 'center'}}>
      <EditAppBar
        title=""
        rightTitle="DONE"
        loading={false}
        onSave={() => { this.props.save() }}
        onClose={() => { this.props.cancel() }} />
      <Content>
        <div style={STYLES.uploadContainer}>
        {
          this.props.images.map(({value, field}, index) =>
            <span style={STYLES.imagesContainer}>
              <img style={STYLES.image} src={value} />
              <NavigationCancel
                style={STYLES.deleteButton}
                onClick={() => {
                  this.props.changeIdCardField('', field)
                }} />
            </span>)
        }
        </div>
        <WebcamCapture storeImageSrcInTheState={(value) =>
          this.props.changeIdCardField(
            value,
            imageKey(this.props.images.map(({field}) => field))
          )
        } />
        <div style={STYLES.uploadButton}>
          <ImageLandscape style={STYLES.loadButtonIcon} />
          <input type="file"
            style={STYLES.inputField}
            onChange={(event) => { this.loadImage(event) }}
            onClick={(event) => { event.target.value = null }} />
        </div>
      </Content>
    </div>)
  }
}
