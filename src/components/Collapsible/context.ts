import { createContext } from 'react'

import { useCustomContext } from '~/hooks/context'
import { ICollapsibleContext } from './types'

export const CollapsibleContext =
  createContext<ICollapsibleContext | undefined>(undefined)
CollapsibleContext.displayName = 'CollapsibleContext'

export const useCollapsible = useCustomContext(CollapsibleContext)
