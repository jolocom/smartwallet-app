import React, { useContext, createContext, useReducer, Dispatch } from 'react'

import deviceAuthReducer, { initialState } from './deviceAuthReducer'
import { StateI, ActionI } from './deviceAuthTypes'

const DeviceAuthStateContext = createContext<StateI>(initialState)
const DeviceAuthDispatchContext = createContext<Dispatch<ActionI>>(
  () => initialState,
)

const DeviceAuthContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(deviceAuthReducer, initialState)
  return (
    <DeviceAuthDispatchContext.Provider value={dispatch}>
      <DeviceAuthStateContext.Provider value={state} children={children} />
    </DeviceAuthDispatchContext.Provider>
  )
}

const useDeviceAuthState = () => {
  return useContext(DeviceAuthStateContext)
}

const useDeviceAuthDispatch = () => {
  return useContext(DeviceAuthDispatchContext)
}

export {
  useDeviceAuthState,
  useDeviceAuthDispatch,
  DeviceAuthContextProvider as default,
}
