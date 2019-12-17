import React from 'react'
import { Notification } from './notifications'
import { connect } from 'react-redux'
import { RootState } from '../../../reducers'
import { compose } from 'redux'
import { NavigationScreenProps } from 'react-navigation'

interface Props
  extends NavigationScreenProps,
    ReturnType<typeof mapStateToProps> {}

const withStickyHOC = <P extends object>(
  Component: React.ComponentType<Props>,
) =>
  class StickyHOC extends React.Component<Props> {
    public render() {
      const { activeNotification } = this.props
      console.log(activeNotification)
      const isSticky =
        activeNotification && activeNotification.dismiss === false
      return (
        <React.Fragment>
          <Component {...(this.props as Props)} />
          {isSticky && <Notification activeNotification={activeNotification} />}
        </React.Fragment>
      )
    }
  }

const mapStateToProps = (state: RootState) => ({
  activeNotification: state.notifications.active,
})

export const withSticky = compose(
  connect(
    mapStateToProps,
    null,
  ),
  withStickyHOC,
)
