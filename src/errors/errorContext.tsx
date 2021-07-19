import React, { useState, useMemo } from 'react'
import { createContext, useContext } from 'react'

import { ErrorDisplay, ErrorReporting } from './modals'

export enum ErrorScreens {
  errorReporting = 'errorReporting',
  errorDisplay = 'errorDisplay',
}

interface IErrorContext {
  error?: Error
  errorScreen?: ErrorScreens
  setError: (screen?: ErrorScreens, err?: Error) => void
}

const initialState = {
  error: undefined,
  errorScreen: undefined,
  setError: () => {},
}

export const ErrorContext = createContext<IErrorContext>(initialState)

export const ErrorContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<
    Pick<IErrorContext, 'error' | 'errorScreen'>
  >({
    error: undefined,
    errorScreen: undefined,
  })

  const contextValue = useMemo<IErrorContext>(
    () => ({
      ...state,
      setError: (errorScreen?: ErrorScreens, error?: Error) =>
        setState({ error, errorScreen }),
    }),
    [JSON.stringify({ state, setState })],
  )

  return (
    <ErrorContext.Provider value={contextValue}>
      <ErrorDisplay />
      <ErrorReporting />
      {children}
    </ErrorContext.Provider>
  )
}

export const useErrorContext = () => {
  return useContext(ErrorContext)
}
