import React, { createContext, useContext, useMemo, useState } from 'react'
import CardHighlight from './CardHighlight'
import CardPhoto from './CardPhoto'
import CardHeader from './CardHeader'
import OptionalFields from './OptionalFields'

interface IField {
  name: string
  value: string | number
}

interface ICardContext {
  numberOfOptionalLines: number
  setNumberOfOptionalLines: React.Dispatch<React.SetStateAction<number>>
  document: any
  givenName: any
  preferredFields: IField[]
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
  preferredFields: IField[]
  mandatoryFields: IField[]
  image: string | undefined
  highlight: string | undefined
}

interface ICardComposition {
  OptionalFields: React.FC
  Header: React.FC
  Highlight: React.FC
  Photo: React.FC
}

const Card: React.FC<IProps> & ICardComposition = ({
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
Card.Header = CardHeader
Card.Highlight = CardHighlight
Card.Photo = CardPhoto

export default Card
