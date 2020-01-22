import * as React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'

import { LoadingSpinner } from './loadingSpinner'
import { Notifications } from '../notifications/containers/notifications'

interface Props extends ReturnType<typeof mapStateToProps> {}

const AppLoadingAndNotificationsContainer: React.FunctionComponent<
  Props
> = props => (props.loading ? <LoadingSpinner /> : <Notifications />)

const mapStateToProps = (state: RootState) => ({
  loading: state.account.loading,
})

export const AppLoadingAndNotifications = connect(mapStateToProps)(
  AppLoadingAndNotificationsContainer,
)
