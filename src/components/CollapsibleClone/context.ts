import { createContext } from 'react'

import { useCustomContext } from '~/hooks/context'
import { ICollapsibleCloneContext } from './types'

export const CollapsibleCloneContext =
  createContext<ICollapsibleCloneContext | undefined>(undefined)
CollapsibleCloneContext.displayName = 'CollapsibleCloneContext'

export const useCollapsibleClone = useCustomContext(CollapsibleCloneContext)
