import React, { ComponentType } from 'react'

export const withClassComponent = (
  WrappedComponent: React.ComponentType<any>,
): ComponentType => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  return class WithClassComponent extends React.Component {
    static displayName = `WithAnimated(${displayName})`

    render(): React.ReactNode {
      return <WrappedComponent {...this.props} />
    }
  }
}
