import React from 'react'
import { CredentialOverview } from '../components/credentialOverview'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { connect } from 'react-redux'
import { accountActions, ssoActions } from 'src/actions'
import { View } from 'react-native'
import { ClaimsState } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
import { QrScanEvent } from './types'

interface ConnectProps {
  setClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
  parseJWT:(jwt: string) => void
  openClaimDetails: (claim: DecoratedClaims) => void
  claims: ClaimsState
}

interface Props extends ConnectProps {}

interface State {
  scanning: boolean
}

export class ClaimsContainer extends React.Component<Props, State> {
  state = {
    scanning: false
  }

  componentWillMount() {
    this.props.setClaimsForDid()
  }

  private onScannerStart = (): void => {
    // this.setState({ scanning: false })
    // this.setState({ scanning: true })
    const data = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJjcmVkZW50aWFsc1JlY2VpdmUiOnsic2lnbmVkQ3JlZGVudGlhbHMiOlt7IkBjb250ZXh0IjpbeyJpZCI6IkBpZCIsInR5cGUiOiJAdHlwZSIsImNyZWQiOiJodHRwczovL3czaWQub3JnL2NyZWRlbnRpYWxzIyIsInNjaGVtYSI6Imh0dHA6Ly9zY2hlbWEub3JnLyIsImRjIjoiaHR0cDovL3B1cmwub3JnL2RjL3Rlcm1zLyIsInhzZCI6Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIyIsInNlYyI6Imh0dHBzOi8vdzNpZC5vcmcvc2VjdXJpdHkjIiwiQ3JlZGVudGlhbCI6ImNyZWQ6Q3JlZGVudGlhbCIsImlzc3VlciI6eyJAaWQiOiJjcmVkOmlzc3VlciIsIkB0eXBlIjoiQGlkIn0sImlzc3VlZCI6eyJAaWQiOiJjcmVkOmlzc3VlZCIsIkB0eXBlIjoieHNkOmRhdGVUaW1lIn0sImNsYWltIjp7IkBpZCI6ImNyZWQ6Y2xhaW0iLCJAdHlwZSI6IkBpZCJ9LCJjcmVkZW50aWFsIjp7IkBpZCI6ImNyZWQ6Y3JlZGVudGlhbCIsIkB0eXBlIjoiQGlkIn0sImV4cGlyZXMiOnsiQGlkIjoic2VjOmV4cGlyYXRpb24iLCJAdHlwZSI6InhzZDpkYXRlVGltZSJ9LCJwcm9vZiI6eyJAaWQiOiJzZWM6cHJvb2YiLCJAdHlwZSI6IkBpZCJ9LCJFY2RzYUtvYmxpdHpTaWduYXR1cmUyMDE2Ijoic2VjOkVjZHNhS29ibGl0elNpZ25hdHVyZTIwMTYiLCJjcmVhdGVkIjp7IkBpZCI6ImRjOmNyZWF0ZWQiLCJAdHlwZSI6InhzZDpkYXRlVGltZSJ9LCJjcmVhdG9yIjp7IkBpZCI6ImRjOmNyZWF0b3IiLCJAdHlwZSI6IkBpZCJ9LCJkb21haW4iOiJzZWM6ZG9tYWluIiwibm9uY2UiOiJzZWM6bm9uY2UiLCJzaWduYXR1cmVWYWx1ZSI6InNlYzpzaWduYXR1cmVWYWx1ZSJ9LHsiUHJvb2ZPZk5hbWVDcmVkZW50aWFsIjoiaHR0cHM6Ly9pZGVudGl0eS5qb2xvY29tLmNvbS90ZXJtcy9Qcm9vZk9mTmFtZUNyZWRlbnRpYWwiLCJzY2hlbWEiOiJodHRwOi8vc2NoZW1hLm9yZy8iLCJmYW1pbHlOYW1lIjoic2NoZW1hOmZhbWlseU5hbWUiLCJnaXZlbk5hbWUiOiJzY2hlbWE6Z2l2ZW5OYW1lIn1dLCJpZCI6ImNsYWltSWQ6YTI5MGE2MDg2ZmI1NyIsIm5hbWUiOiJOYW1lIiwiaXNzdWVyIjoiZGlkOmpvbG86YjMxMGQyOTNhZWFjOGE1Y2E2ODAyMzJiOTY5MDFmZTg1OTg4ZmRlMjg2MGExYTVkYjY5YjQ5NzYyOTIzY2M4OCIsInR5cGUiOlsiQ3JlZGVudGlhbCIsIlByb29mT2ZOYW1lQ3JlZGVudGlhbCJdLCJjbGFpbSI6eyJnaXZlbk5hbWUiOiJFdWdlbml1IiwiZmFtaWx5TmFtZSI6IlJ1c3UiLCJpZCI6ImRpZDpqb2xvOjYzNTc4YmUwMWMyM2QxNzk1OTUzOWJmMDBkNzA0MWNkNjA4MjQ2ODgwOGI2MmRiYzFmNDZiNDUyZThlNTYyNGEifSwiaXNzdWVkIjoiMjAxOC0xMC0xNlQxNjoxMTo0OC40NDJaIiwiZXhwaXJlcyI6IjIwMTktMTAtMTZUMTY6MTE6NDguNDQyWiIsInByb29mIjp7InR5cGUiOiJFY2RzYUtvYmxpdHpTaWduYXR1cmUyMDE2IiwiY3JlYXRlZCI6IjIwMTgtMTAtMTZUMTY6MTE6NDguNDQyWiIsImNyZWF0b3IiOiJkaWQ6am9sbzpiMzEwZDI5M2FlYWM4YTVjYTY4MDIzMmI5NjkwMWZlODU5ODhmZGUyODYwYTFhNWRiNjliNDk3NjI5MjNjYzg4I2tleXMtMSIsIm5vbmNlIjoiZTQxZGE2Njc2YTdlNiIsInNpZ25hdHVyZVZhbHVlIjoidkpGN2V6Mm9UR0ppS3ZsbXFENlJ1QnhjRVdRblpUSjFFMFJWRzhVZ0FnUVF5eHhvY3FEa1dkRm9YTGx2MjlKL2YwK05lUytzendidlRjNmMyc3lINnc9PSJ9fSx7IkBjb250ZXh0IjpbeyJpZCI6IkBpZCIsInR5cGUiOiJAdHlwZSIsImNyZWQiOiJodHRwczovL3czaWQub3JnL2NyZWRlbnRpYWxzIyIsInNjaGVtYSI6Imh0dHA6Ly9zY2hlbWEub3JnLyIsImRjIjoiaHR0cDovL3B1cmwub3JnL2RjL3Rlcm1zLyIsInhzZCI6Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIyIsInNlYyI6Imh0dHBzOi8vdzNpZC5vcmcvc2VjdXJpdHkjIiwiQ3JlZGVudGlhbCI6ImNyZWQ6Q3JlZGVudGlhbCIsImlzc3VlciI6eyJAaWQiOiJjcmVkOmlzc3VlciIsIkB0eXBlIjoiQGlkIn0sImlzc3VlZCI6eyJAaWQiOiJjcmVkOmlzc3VlZCIsIkB0eXBlIjoieHNkOmRhdGVUaW1lIn0sImNsYWltIjp7IkBpZCI6ImNyZWQ6Y2xhaW0iLCJAdHlwZSI6IkBpZCJ9LCJjcmVkZW50aWFsIjp7IkBpZCI6ImNyZWQ6Y3JlZGVudGlhbCIsIkB0eXBlIjoiQGlkIn0sImV4cGlyZXMiOnsiQGlkIjoic2VjOmV4cGlyYXRpb24iLCJAdHlwZSI6InhzZDpkYXRlVGltZSJ9LCJwcm9vZiI6eyJAaWQiOiJzZWM6cHJvb2YiLCJAdHlwZSI6IkBpZCJ9LCJFY2RzYUtvYmxpdHpTaWduYXR1cmUyMDE2Ijoic2VjOkVjZHNhS29ibGl0elNpZ25hdHVyZTIwMTYiLCJjcmVhdGVkIjp7IkBpZCI6ImRjOmNyZWF0ZWQiLCJAdHlwZSI6InhzZDpkYXRlVGltZSJ9LCJjcmVhdG9yIjp7IkBpZCI6ImRjOmNyZWF0b3IiLCJAdHlwZSI6IkBpZCJ9LCJkb21haW4iOiJzZWM6ZG9tYWluIiwibm9uY2UiOiJzZWM6bm9uY2UiLCJzaWduYXR1cmVWYWx1ZSI6InNlYzpzaWduYXR1cmVWYWx1ZSJ9LHsiUHJvb2ZPZkVtYWlsQ3JlZGVudGlhbCI6Imh0dHBzOi8vaWRlbnRpdHkuam9sb2NvbS5jb20vdGVybXMvUHJvb2ZPZkVtYWlsQ3JlZGVudGlhbCIsInNjaGVtYSI6Imh0dHA6Ly9zY2hlbWEub3JnLyIsImVtYWlsIjoic2NoZW1hOmVtYWlsIn1dLCJpZCI6ImNsYWltSWQ6NjgwZTAxMjZlMWJiNCIsIm5hbWUiOiJFbWFpbCBhZGRyZXNzIiwiaXNzdWVyIjoiZGlkOmpvbG86YjMxMGQyOTNhZWFjOGE1Y2E2ODAyMzJiOTY5MDFmZTg1OTg4ZmRlMjg2MGExYTVkYjY5YjQ5NzYyOTIzY2M4OCIsInR5cGUiOlsiQ3JlZGVudGlhbCIsIlByb29mT2ZFbWFpbENyZWRlbnRpYWwiXSwiY2xhaW0iOnsiZW1haWwiOiJldWdlbml1QGpvbG9jb20uY29tIiwiaWQiOiJkaWQ6am9sbzo2MzU3OGJlMDFjMjNkMTc5NTk1MzliZjAwZDcwNDFjZDYwODI0Njg4MDhiNjJkYmMxZjQ2YjQ1MmU4ZTU2MjRhIn0sImlzc3VlZCI6IjIwMTgtMTAtMTZUMTY6MTE6NDguNDU0WiIsImV4cGlyZXMiOiIyMDE5LTEwLTE2VDE2OjExOjQ4LjQ1NFoiLCJwcm9vZiI6eyJ0eXBlIjoiRWNkc2FLb2JsaXR6U2lnbmF0dXJlMjAxNiIsImNyZWF0ZWQiOiIyMDE4LTEwLTE2VDE2OjExOjQ4LjQ1NFoiLCJjcmVhdG9yIjoiZGlkOmpvbG86YjMxMGQyOTNhZWFjOGE1Y2E2ODAyMzJiOTY5MDFmZTg1OTg4ZmRlMjg2MGExYTVkYjY5YjQ5NzYyOTIzY2M4OCNrZXlzLTEiLCJub25jZSI6ImVlNjQxMjkxNjk0ZjgiLCJzaWduYXR1cmVWYWx1ZSI6IndwYVZFNURjVXBaRVIxeDgyMXoxV2prMkxWVEk0ZmtQNUxVYmg3aC9HU0pJVkxIWGhxWFZLamwwSmNtSHVLYW12eFBISElVTGtmTzZ0bHJQbkNuNHB3PT0ifX1dfSwidHlwIjoiY3JlZGVudGlhbHNSZWNlaXZlIiwiaWF0IjoxNTM5NzA2MzA4NDU5LCJpc3MiOiJkaWQ6am9sbzpiMzEwZDI5M2FlYWM4YTVjYTY4MDIzMmI5NjkwMWZlODU5ODhmZGUyODYwYTFhNWRiNjliNDk3NjI5MjNjYzg4I2tleXMtMSJ9.4bOjABSSZVyNlFnkqOODCD8yGjNxWcf1jCZV3ijnNZhuzGn5ml3rnwp7D4KuZS7Aww_9km2rOruVHF5zNuT8aQ'
    this.props.parseJWT(data)
  }

  private onScannerCancel = (): void => {
    this.setState({ scanning: false })
  }

  private onScannerSuccess = (e: QrScanEvent): void => {
    this.setState({ scanning: false })
    this.props.parseJWT(e.data)
  }

  render() {
    if (this.state.scanning) {
      return <QRcodeScanner onScannerSuccess={this.onScannerSuccess} onScannerCancel={this.onScannerCancel} />
    }

    return (
      <View style={{ flex: 1 }}>
        <CredentialOverview
          claimsState={this.props.claims}
          loading={this.props.claims.loading}
          onEdit={this.props.openClaimDetails}
          scanning={this.state.scanning}
          onScannerStart={this.onScannerStart}
        />
      </View>
    )
  }
}

// TODO nicer pattern for accessing state, perhaps immer or something easier to Type
const mapStateToProps = (state: any) => {
  return {
    claims: state.account.claims.toJS()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    openClaimDetails: (claim: DecoratedClaims) => dispatch(accountActions.openClaimDetails(claim)),
    setClaimsForDid: () => dispatch(accountActions.setClaimsForDid()),
    toggleLoading: (val: boolean) => dispatch(accountActions.toggleLoading(val)),
    parseJWT: (jwt: string) => dispatch(ssoActions.parseJWT(jwt))
  }
}

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimsContainer)
