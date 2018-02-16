import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'material-ui/List'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { Content, Block } from '../../structure'
import Camera from 'material-ui/svg-icons/image/camera-alt'
import {
  TabContainer,
  HalfScreenContainer,
  AttributeDisplay,
  QRFrame
} from './ui'

const STYLES = {
  qrBtnVisible: {
    position: 'absolute',
    bottom: '24px',
    right: '15px',
    visibility: 'visible'
  },
  qrBtnHidden: {
    position: 'absolute',
    bottom: '24px',
    right: '15px',
    display: 'none'
  }
}

export default class IdentityNew extends React.Component {
  static propTypes = {
    identityNew: PropTypes.object,
    enterField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    toggleEditField: PropTypes.func.isRequired,
    toggleQRScan: PropTypes.func.isRequired
  }

  render() {
    const claims = ['name', 'phone', 'email']
    const qrButton = (
      <FloatingActionButton
        mini
        secondary
        // eslint-disable-next-line
        style={this.props.identityNew.toggleEdit.bool ? STYLES['qrBtnHidden'] : STYLES.qrBtnVisible}
        onClick={() => this.props.toggleQRScan()}
      >
        <Camera />
      </FloatingActionButton>
    )

    let content

    if (this.props.identityNew.scanningQr.scanning) {
      content = (<QRFrame />)
    } else {
      content = (
        <List>
          {claims.map((claim) => {
            return (<AttributeDisplay
              id={claim}
              key={claim}
              enterField={this.props.enterField}
              saveAttribute={this.props.saveAttribute}
              identity={this.props.identityNew}
              toggleEditField={this.props.toggleEditField} />)
          })}
        </List>
      )
    }

    return (
      <TabContainer>
        <HalfScreenContainer>
          <Content>
            <Block>
              {content}
            </Block>
          </Content>
        </HalfScreenContainer>
        {qrButton}
      </TabContainer>
    )
  }
}
