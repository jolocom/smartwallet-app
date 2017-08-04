import React from 'react'
import Radium from 'radium'

import {theme} from 'styles'
import Camera from 'material-ui/svg-icons/image/camera-alt'
import { Badge, IconButton, FloatingActionButton } from 'material-ui'
import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

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
    backgroundColor: theme.jolocom.gray2,
    textAlign: 'left'
  },
  uploadBtn: {
    margin: '10px'
  },
  imageField: {
    height: '24px',
    height: '60px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  verifierLocationsMsg: {
    width: '100%',
    textAlign: 'center'
  }
}

@Radium
export default class WalletIdCardPhoto extends React.Component {
  static propTypes = {
    changeIdCardField:  React.PropTypes.func,
    images: React.PropTypes.array
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
            <span style={{width: '60px', height: '46px'}}>
              <img style={{width: '60px'}} src={value} />
              <NavigationCancel style={{position: 'relative', top: '-32px', right: '8px'}}
              onClick={(value) => this.props.changeIdCardField('', index)} />
            </span>)
        }
        </div>
        <WebcamCapture storeImageSrcInTheState={(value) =>
          this.props.changeIdCardField(value, this.props.images.length)
        } />,
      </Content>
    </div>)
  }
}

// <img style={{height: '48px'}} src={imgSrc} />
