import React from 'react'
import { Notification } from './notifications'

export const withNotifications = <P extends object>(
  Component: React.ComponentType<P>,
) =>
  class NotificationsHOC extends React.Component<P> {
    public render() {
      return (
        <React.Fragment>
          <Component {...(this.props as P)} />
          <Notification />
        </React.Fragment>
      )
    }
  }
