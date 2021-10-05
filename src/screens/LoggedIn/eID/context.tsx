import React, { createContext, useMemo, useState } from 'react'
import { AusweisContextValue, AusweisRequest } from './types'

export const ausweisInitialState = {
  requiredFields: [],
  optionalFields: [],
  certificateIssuerName: '',
  certificateIssuerUrl: '',
  providerName: '',
  providerUrl: '',
  effectiveValidityDate: '',
  expirationDate: '',
}

const ausweisActions = {
  setRequest: () => null,
  resetRequest: () => null,
}

export const AusweisContext = createContext<AusweisContextValue | undefined>({
  ...ausweisInitialState,
  ...ausweisActions,
})
AusweisContext.displayName = 'AusweisContext'

export const AusweisProvider: React.FC = ({ children }) => {
  const [requestData, setRequestData] =
    useState<AusweisRequest>(ausweisInitialState)

  const setRequest = (request: AusweisRequest) => {
    setRequestData(request)
  }

  const resetRequest = () => {
    setRequestData(ausweisInitialState)
  }

  const contextValue = useMemo(
    () => ({
      ...requestData,
      setRequest,
      resetRequest,
    }),
    [requestData, JSON.stringify(setRequestData)],
  )

  return <AusweisContext.Provider value={contextValue} children={children} />
}
