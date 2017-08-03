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
    backgroundColor: theme.jolocom.gray5,
    textAlign: 'left'
  },
  uploadBtn: {
    margin: '10px'
  },
  imageField: {
    flex: 1,
    height: '60px',
    margin: 'auto',
    userSelect: 'none',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(img/JOLOCOM_logo-01.svg)'
  },
  verifierLocationsMsg: {
    width: '100%',
    textAlign: 'center'
  }
}

@Radium
export default class WalletIdCardPhoto extends React.Component {
  static propTypes = {
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
          this.props.images.map(({imgSrc}) =>
            <Badge style={{width: '120px'}}
              badgeContent={<IconButton>
                <NavigationCancel />
              </IconButton>} >
              <div style={STYLES.imageField} />
            </Badge>)
        }
        </div>
        <WebcamCapture storeImageSrcInTheState={() => {}} />,
      </Content>
    </div>)
  }
}
