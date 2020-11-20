import React, { useState, useMemo } from 'react'
import { createContext, useContext } from 'react'

import { ErrorDisplay, ErrorReporting } from './modals'

export enum ErrorScreens {
  errorReporting = 'errorReporting',
  errorDisplay = 'errorDisplay',
}

interface IErrorContext {
  error: Error | null
  errorScreen: ErrorScreens | null
  setError: (screen: ErrorScreens, err: Error | null) => void
}

const initialState = {
  error: null,
  errorScreen: null,
  setError: () => {},
}

export const ErrorContext = createContext<IErrorContext>(initialState)

export const ErrorContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<
    Pick<IErrorContext, 'error' | 'errorScreen'>
  >({
    error: null,
    errorScreen: null,
  })

  const setError = (errorScreen: ErrorScreens, error: Error | null) =>
    setState({ error, errorScreen })

  const contextValue = useMemo<IErrorContext>(
    () => ({
      ...state,
      setError,
    }),
    [state, setState],
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
