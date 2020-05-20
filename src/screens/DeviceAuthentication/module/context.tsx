import React, { useContext, createContext, useReducer, Dispatch } from 'react'

import deviceAuthReducer, { StateI } from './reducer'

const DeviceAuthStateContext = createContext<StateI>(null)
const DeviceAuthDispatchContext = createContext<Dispatch<StateI>>(() => null)

const DeviceAuthContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(deviceAuthReducer, null)
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
