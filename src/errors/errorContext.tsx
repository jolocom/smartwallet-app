import React, { useState, useMemo } from 'react'
import { createContext, useContext } from 'react'

import { ErrorDisplay, ErrorReporting } from './modals'

export enum ErrorScreens {
  errorReporting = 'errorReporting',
  errorDisplay = 'errorDisplay',
}

export interface ErrorDetails {
  title: string
  message: string
}

interface IErrorContext {
  error?: Error
  errorScreen?: ErrorScreens
  errorDetails?: ErrorDetails
  setError: (
    screen?: ErrorScreens,
    err?: Error,
    errorDetails?: ErrorDetails,
  ) => void
}

const initialState = {
  error: undefined,
  errorScreen: undefined,
  errorDetails: undefined,
  setError: () => {},
}

export const ErrorContext = createContext<IErrorContext>(initialState)

export const ErrorContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<
    Pick<IErrorContext, 'error' | 'errorScreen' | 'errorDetails'>
  >({
    error: undefined,
    errorScreen: undefined,
    errorDetails: undefined,
  })

  const contextValue = useMemo<IErrorContext>(
    () => ({
      ...state,
      setError: (
        errorScreen?: ErrorScreens,
        error?: Error,
        errorDetails?: ErrorDetails,
      ) => setState({ error, errorScreen, errorDetails }),
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
