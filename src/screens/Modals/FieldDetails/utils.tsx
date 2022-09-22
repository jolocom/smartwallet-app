import React from 'react'
import * as Icon from '~/assets/svg/mdl'

import { VehicleClasses } from './types'

const getVehicleIcon = (vehicleClass: VehicleClasses) => {
  switch (vehicleClass) {
    case VehicleClasses.A:
      return <Icon.A />
    case VehicleClasses.A1:
      return <Icon.A1 />
    case VehicleClasses.A2:
      return <Icon.A2 />
    case VehicleClasses.AM:
      return <Icon.AM />
    case VehicleClasses.B96:
      return <Icon.B96 />
    case VehicleClasses.B:
      return <Icon.BBF17 />
    case VehicleClasses.BE:
      return <Icon.BE />
    case VehicleClasses.C:
      return <Icon.C />
    case VehicleClasses.C1:
      return <Icon.C1 />
    case VehicleClasses.C1E:
      return <Icon.C1E />
    case VehicleClasses.CE:
      return <Icon.CE />
    case VehicleClasses.D:
      return <Icon.D />
    case VehicleClasses.D1:
      return <Icon.D1 />
    case VehicleClasses.D1E:
      return <Icon.D1E />
    case VehicleClasses.DE:
      return <Icon.DE />
    case VehicleClasses.L:
      return <Icon.L />
    case VehicleClasses.T:
      return <Icon.T />
    default:
      return null
  }
}

export default getVehicleIcon
