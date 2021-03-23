import { createContext } from 'react'

import { IWidgetProps } from './types'
import { useCustomContext } from '~/hooks/context'

export const WidgetContext = createContext<IWidgetProps | undefined>(undefined)

export const useWidget = useCustomContext(WidgetContext)
