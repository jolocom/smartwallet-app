import React from 'react'
import * as Icon from '~/assets/svg/mdl'

const getVehicleIcon = (vehicleClass: string) => {
  console.log({ vehicleClass })
  switch (vehicleClass) {
    case 'A':
      return <Icon.A />
    case 'A1':
      return <Icon.A1 />
    case 'A2':
      return <Icon.A2 />
    case 'AM':
      return <Icon.AM />
    case 'B96':
      return <Icon.B96 />
    case 'B':
      return <Icon.BBF17 />
    case 'BE':
      return <Icon.BE />
    case 'C':
      return <Icon.C />
    case 'C1':
      return <Icon.C1 />
    case 'C1E':
      return <Icon.C1E />
    case 'CE':
      return <Icon.CE />
    case 'D':
      return <Icon.D />
    case 'D1':
      return <Icon.D1 />
    case 'D1E':
      return <Icon.D1E />
    case 'DE':
      return <Icon.DE />
    case 'L':
      return <Icon.L />
    case 'T':
      return <Icon.T />
    default:
      return null
  }
}

export default getVehicleIcon
