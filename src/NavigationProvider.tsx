import React, { RefObject } from 'react'
import { createContext, useContext } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { ScreenNames } from './types/screens'

/* NOTE: exposing the navigation container through a context for components
 *       which are rendered outside the RootNavigation component. This enables
 *       use to navigate from any component wrapped with the context provider.
 */

const NavigationContext = createContext<RefObject<
  NavigationContainerRef
> | null>(null)

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

export const NavigationContextProvider: React.FC<Props> = ({
  children,
  navRef,
}) => {
  return <NavigationContext.Provider value={navRef} children={children} />
}

// NOTE: In case we need to navigate from outside the @RootNavigation routes
// (e.g. Overlays), we should use the hooks below instead of the ones provided by
// the navigation system and `~/hooks/navigation`.

export const useOutsideNavigation = () => {
  const navRef = useContext(NavigationContext)

  if (!navRef) {
    throw new Error('Cannot find the "Outside" navigation provider')
  }

  if (!navRef?.current) {
    console.warn("Navigation wasn't initialized yet")
    return
  }

  return navRef.current
}

export const useOutsideRedirect = () => {
  const navigation = useOutsideNavigation()

  return (route: ScreenNames) => navigation?.navigate(route)
}
