import React, { createContext, useContext, useMemo, useState } from 'react'
import CardHighlight from './CardHighlight'
import CardPhoto from './CardPhoto'
import DocumentHeader from './DocumentHeader'
import Dots from './Dots'
import OptionalFields from './OptionalFields'
import OtherHeader from './OtherHeader'
import { DocumentFields, IField, IWithCustomStyle, ICardProps } from './types'

interface ICardContext {
  numberOfOptionalLines: number
  setNumberOfOptionalLines: React.Dispatch<React.SetStateAction<number>>
  document: IField | undefined
  restMandatoryField: IField | undefined
  optionalFields: IField[]
  image?: string | undefined
  highlight?: string | undefined
}

const CardContext = createContext<ICardContext | undefined>(undefined)

export const useCard = () => {
  const context = useContext(CardContext)
  if (!context) throw new Error('Cannot be used outside CardContext')
  return context
}

interface ICardComposition {
  OptionalFields: React.FC<IWithCustomStyle>
  DocumentHeader: React.FC
  OtherHeader: React.FC
  Highlight: React.FC
  Photo: React.FC
  Dots: React.FC<IWithCustomStyle>
}

const Card: React.FC<ICardProps> & ICardComposition = ({
  children,
  optionalFields,
  mandatoryFields,
  image,
  highlight,
}) => {
  const [numberOfOptionalLines, setNumberOfOptionalLines] = useState(0)

  const getFieldInfo = (fieldName: string) =>
    mandatoryFields.find((el) => el.name === fieldName)

  const document = getFieldInfo(DocumentFields.DocumentName)
  const [restMandatoryField] = mandatoryFields.filter(
    (f) => f.name !== DocumentFields.DocumentName,
  )

  const contextValue = useMemo(
    () => ({
      numberOfOptionalLines,
      setNumberOfOptionalLines,
      document,
      restMandatoryField,
      optionalFields,
      image,
      highlight,
    }),
    [numberOfOptionalLines],
  )
  return <CardContext.Provider value={contextValue} children={children} />
}

Card.OptionalFields = OptionalFields
Card.DocumentHeader = DocumentHeader
Card.OtherHeader = OtherHeader
Card.Highlight = CardHighlight
Card.Photo = CardPhoto
Card.Dots = Dots

export default Card
