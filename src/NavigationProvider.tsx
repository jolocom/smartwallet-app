import React, { RefObject } from 'react'
import { createContext, useContext } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { ScreenNames } from './types/screens'

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
