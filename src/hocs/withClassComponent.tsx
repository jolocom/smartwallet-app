import React, { ComponentType } from 'react'

export const withClassComponent = (
  WrappedComponent: React.ComponentType<any>,
): ComponentType => {
  return class WithClassComponent extends React.Component {
    render(): React.ReactNode {
      return <WrappedComponent {...this.props} />
    }
  }
}
