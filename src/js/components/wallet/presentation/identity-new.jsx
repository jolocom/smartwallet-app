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
  QRScanner
} from './ui'

const STYLES = {
  qrBtn: {
    position: 'absolute',
    bottom: '24px',
    right: '15px'
  }
}

export default class IdentityNew extends React.Component {
  static propTypes = {
    identityNew: PropTypes.object,
    enterField: PropTypes.func.isRequired,
    saveAttribute: PropTypes.func.isRequired,
    toggleEditField: PropTypes.func.isRequired,
    toggleQRScan: PropTypes.func.isRequired,
    verifyAttribute: PropTypes.func,
    setFocusedPin: PropTypes.func,
    changePinValue: PropTypes.func,
    requestVerificationCode: PropTypes.func,
    onConfirm: PropTypes.func,
    enterVerificationCode: PropTypes.func
  }

  render() {
    const claims = ['name', 'phone', 'email']
    const qrButton = (
      <FloatingActionButton
        mini
        secondary
        style={STYLES.qrBtn}
        onClick={() => this.props.toggleQRScan({
          value: this.props.identityNew.qrscan
        })}>
        <Camera />
      </FloatingActionButton>
    )

    let content
    if (this.props.identityNew.qrscan) {
      content = (<QRScanner />)
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
              toggleEditField={this.props.toggleEditField}
              verifyAttribute={this.props.verifyAttribute}
              onConfirm={this.props.onConfirm}
              requestVerificationCode={this.props.requestVerificationCode}
              enterVerificationCode={this.props.enterVerificationCode}
              resendVerificationCode={this.props.resendVerificationCode}
              changePinValue={this.props.changePinValue}
              setFocusedPin={this.props.setFocusedPin}
              />)
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
