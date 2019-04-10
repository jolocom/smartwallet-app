import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Button } from 'react-native-material-ui'
import { QrScanEvent } from 'src/ui/generic/qrcodeScanner'
import { ssoActions, navigationActions } from 'src/actions'
import I18n from 'src/locales/i18n'
import { LoadingSpinner } from './loadingSpinner'
const QRScanner = require('react-native-qrcode-scanner').default

export interface QrScanEvent {
  data: string
}

interface Props {
  loading: boolean
  onScannerSuccess: (e: QrScanEvent) => void
  onScannerCancel: () => void
}

interface State {}

const styles = StyleSheet.create({
  buttonText: {
    color: JolocomTheme.primaryColorBlack,
  },
})

export class QRcodeScanner extends React.Component<Props, State> {
  render() {
    const { loading, onScannerSuccess, onScannerCancel } = this.props
    if (loading) {
      return <LoadingSpinner />
    }
    return (
      <Container>
        <QRScanner
          onRead={(e: QrScanEvent) => onScannerSuccess(e)}
          topContent={<Text>{I18n.t('You can scan the qr code now!')}</Text>}
          bottomContent={
            <Button
              onPress={onScannerCancel}
              style={{ text: styles.buttonText }}
              text={I18n.t('Cancel')}
            />
          }
        />
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.account.loading.toJS().loading,
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    onScannerSuccess: (e: QrScanEvent) => dispatch(ssoActions.parseJWT(e.data)),
    onScannerCancel: () => dispatch(navigationActions.goBack()),
  }
}

export const QRScannerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(QRcodeScanner)
