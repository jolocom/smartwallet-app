import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'

import { LoadingScreen } from './loading'
import { LoadingSpinner } from './loadingSpinner'

interface Props extends ReturnType<typeof mapStateToProps> {}

export const AppLoadingContainer: React.SFC<Props> = props =>
  props.loading || props.loading2 ? (
    props.hasIdentity ? (
      <LoadingSpinner />
    ) : (
      <LoadingScreen />
    )
  ) : null

const mapStateToProps = (state: RootState) => ({
  loading: state.account.loading.loading,
  loading2: state.sso.deepLinkLoading,
  hasIdentity: !!state.account.did.did,
})

export const AppLoading = connect(mapStateToProps)(AppLoadingContainer)
