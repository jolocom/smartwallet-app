import React, { useMemo } from 'react'
import CardHighlight from './CardHighlight'
import CardPhoto from './CardPhoto'
import DocumentHeader from './DocumentHeader'
import DocumentDots from './DocumentDots'
import OptionalFields from './OptionalFields'
import OtherHeader from './OtherHeader'
import { ICardProps, ICardComposition } from './types'
import { DocumentFields } from '~/types/credentials'
import { CardContext } from './context'

const Card: React.FC<ICardProps> & ICardComposition = ({
  children,
  id,
  type,
  optionalFields,
  mandatoryFields,
  photo,
  highlight,
}) => {
  const getFieldInfo = (fieldName: string) =>
    mandatoryFields.find((el) => el?.label === fieldName)

  const document = getFieldInfo(DocumentFields.DocumentName)
  const [restMandatoryField] = mandatoryFields.filter(
    (f) => f?.label !== DocumentFields.DocumentName,
  )

  const contextValue = useMemo(
    () => ({
      id,
      type,
      document,
      restMandatoryField,
      optionalFields,
      photo,
      highlight,
    }),
    [],
  )
  return <CardContext.Provider value={contextValue} children={children} />
}

Card.OptionalFields = OptionalFields
Card.DocumentHeader = DocumentHeader
Card.OtherHeader = OtherHeader
Card.Highlight = CardHighlight
Card.Photo = CardPhoto
Card.Dots = DocumentDots

export default Card
