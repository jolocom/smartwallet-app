import React, { useContext, createContext, useReducer, Dispatch } from 'react'

import reducer, { initialState } from './reducer'
import { StateI, ActionI } from './types'

const RecoveryStateContext = createContext<StateI>(initialState)
const RecoveryDispatchContext = createContext<Dispatch<ActionI>>(() => null)

const RecoveryContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <RecoveryDispatchContext.Provider value={dispatch}>
      <RecoveryStateContext.Provider value={state} children={children} />
    </RecoveryDispatchContext.Provider>
  )
}

const useRecoveryState = () => {
  return useContext(RecoveryStateContext)
}

const useRecoveryDispatch = () => {
  return useContext(RecoveryDispatchContext)
}

export {
  useRecoveryState,
  useRecoveryDispatch,
  RecoveryContextProvider as default,
}
