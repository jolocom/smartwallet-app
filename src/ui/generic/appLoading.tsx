import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'

import { LoadingSpinner } from './loadingSpinner'

interface Props extends ReturnType<typeof mapStateToProps> {}

export const AppLoadingContainer: React.FunctionComponent<Props> = props =>
  props.loading ? <LoadingSpinner /> : null

const mapStateToProps = (state: RootState) => ({
  loading: state.account.loading,
})

export const AppLoading = connect(mapStateToProps)(AppLoadingContainer)
