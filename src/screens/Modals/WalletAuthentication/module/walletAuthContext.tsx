import React, { useContext, createContext, useReducer, Dispatch } from 'react'

import walletAuthReducer, { initialState } from './walletAuthReducer'
import { StateI, ActionI } from './walletAuthTypes'

const WalletAuthStateContext = createContext<StateI>(initialState)
const WalletAuthDispatchContext = createContext<Dispatch<ActionI>>(
  () => initialState,
)

const WalletAuthContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(walletAuthReducer, initialState)
  return (
    <WalletAuthDispatchContext.Provider value={dispatch}>
      <WalletAuthStateContext.Provider value={state} children={children} />
    </WalletAuthDispatchContext.Provider>
  )
}

const useWalletAuthState = () => {
  return useContext(WalletAuthStateContext)
}

const useWalletAuthDispatch = () => {
  return useContext(WalletAuthDispatchContext)
}

export {
  useWalletAuthState,
  useWalletAuthDispatch,
  WalletAuthContextProvider as default,
}
