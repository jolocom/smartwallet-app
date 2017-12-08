import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import NavigationCancel from 'material-ui/svg-icons/navigation/close'
import ImageLandscape from 'material-ui/svg-icons/image/landscape'

import {theme} from 'styles'
import { EditAppBar, WebcamCapture } from './ui'
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
    borderRadius: '3px'
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

@Radium
export default class WebCamPresentation extends React.Component {
  static propTypes = {
    addPhoto: PropTypes.func,
    cancel: PropTypes.func,
    deletePhoto: PropTypes.func,
    photos: PropTypes.array,
    save: PropTypes.func
  }

  loadImage(event) {
    let file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.props.addPhoto(reader.result, this.props.photos.length)
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
          this.props.photos.map(({value}, index) => (<span
            key={`image_${index}`} style={STYLES.imagesContainer}>
            <img style={STYLES.image} src={value} />
            <NavigationCancel
              style={STYLES.deleteButton}
              onClick={() => { this.props.deletePhoto(index) }} />
          </span>))
        }
        </div>
        <WebcamCapture storeImageSrcInTheState={(value) => {
          this.props.addPhoto(value, this.props.photos.length)
        }} />
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
