import React, { useEffect, Children } from 'react'

import { HidingTextContainer } from './components/HidingTextContainer'

// NOTE: should wrap @Collapsible list components that pass the @HidingTextContainer as
// a child i.e. @Collapsible.ScrollView
export const withListError = <T extends {}>(
  WrappedComponent: React.ComponentType<T>,
) => (props: T) => {
  const checkListHidingTextContainer = (listChildren: React.ReactNode) => {
    const isHidingTextContainer = Children.toArray(listChildren).some(
      (child) => {
        // @ts-ignore
        return child.type.displayName === HidingTextContainer.displayName
      },
    )

    if (!isHidingTextContainer) {
      throw new Error(
        `${HidingTextContainer.displayName} must be a direct child of a Collapsible scroll/list component`,
      )
    }
  }

  // @ts-ignore
  useEffect(() => checkListHidingTextContainer(props.children), [])

  return <WrappedComponent {...props} />
}
