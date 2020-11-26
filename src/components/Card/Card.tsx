import React, { createContext, useContext, useMemo, useState } from 'react'
import CardHighlight from './CardHighlight'
import CardPhoto from './CardPhoto'
import Header from './Header'
import OptionalFields from './OptionalFields'

interface ICardContext {
  numberOfOptionalLines: number
  setNumberOfOptionalLines: (value: number) => void
  document: any
  givenName: any
  image: string | undefined
  highlight: string | undefined
}

const CardContext = createContext<ICardContext | undefined>(undefined)

export const useCard = () => {
  const context = useContext(CardContext)
  if (!context) throw new Error('Cannot be used outside CardContext')
  return context
}

interface IProps {
  preferredFields: Array<any>
  mandatoryFields: Array<any>
  image: string | undefined
  highlight: string | undefined
}

interface ICardComposition {
  OptionalFields: React.FC
}

const Card: React.FC<IProps & ICardComposition> = ({
  children,
  preferredFields,
  mandatoryFields,
  image,
  highlight,
}) => {
  const [numberOfOptionalLines, setNumberOfOptionalLines] = useState(0)

  const getFieldInfo = (fieldName: string) =>
    mandatoryFields.find((el) => el.name === fieldName)

  const document = getFieldInfo('Document Type')
  const givenName = getFieldInfo('Given Name')
  const contextValue = useMemo(
    () => ({
      numberOfOptionalLines,
      setNumberOfOptionalLines,
      document,
      givenName,
      preferredFields,
      image,
      highlight,
    }),
    [numberOfOptionalLines],
  )
  return <CardContext.Provider value={contextValue} children={children} />
}

Card.OptionalFields = OptionalFields
Card.Header = Header
Card.Highlight = CardHighlight
Card.Photo = CardPhoto

export default Card
