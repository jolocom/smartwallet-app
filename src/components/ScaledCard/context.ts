import { createContext } from 'react'

import { IScaledCardContext } from './types'
import { useCustomContext } from '~/hooks/context'

export const ScaledCardContext =
  createContext<IScaledCardContext | undefined>(undefined)

export const useScaledCard = useCustomContext(ScaledCardContext)
