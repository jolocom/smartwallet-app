import { createContext } from 'react'
import { ICardProps, IField } from './types'
import { useCustomContext } from '~/hooks/context'

interface ICardContext extends Omit<ICardProps, 'mandatoryFields'> {
  document: IField | undefined | null
  restMandatoryField: IField | undefined | null
}

export const CardContext = createContext<ICardContext | undefined>(undefined)
CardContext.displayName = 'CardContext'

export const useCard = useCustomContext(CardContext)
