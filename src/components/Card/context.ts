import { createContext } from 'react'
import { IField } from './types'
import { useCustomContext } from '~/hooks/context'

interface ICardContext {
  id: string
  document: IField | undefined | null
  restMandatoryField: IField | undefined | null
  optionalFields: IField[]
  image?: string | undefined
  highlight?: string | undefined
  claims: IField[]
}

export const CardContext = createContext<ICardContext | undefined>(undefined)
CardContext.displayName = 'CardContext'

export const useCard = useCustomContext(CardContext)
