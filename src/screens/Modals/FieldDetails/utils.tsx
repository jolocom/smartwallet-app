import React from 'react'
import {
  A,
  A1,
  A2,
  AM,
  B96,
  BBF17,
  BE,
  C,
  C1,
  C1E,
  CE,
  D,
  D1,
  D1E,
  DE,
  L,
  T,
} from '~/assets/svg/mdl'

const getVehicleIcon = (vehicleClass: string) => {
  switch (vehicleClass) {
    case 'A':
      return <A />
    case 'A1':
      return <A1 />
    case 'A2':
      return <A2 />
    case 'AM':
      return <AM />
    case 'B96':
      return <B96 />
    case 'BBF17':
      return <BBF17 />
    case 'BE':
      return <BE />
    case 'C':
      return <C />
    case 'C1':
      return <C1 />
    case 'C1E':
      return <C1E />
    case 'CE':
      return <CE />
    case 'D':
      return <D />
    case 'D1':
      return <D1 />
    case 'D1E':
      return <D1E />
    case 'DE':
      return <DE />
    case 'L':
      return <L />
    case 'T':
      return <T />
    default:
      return null
  }
}

export default getVehicleIcon
