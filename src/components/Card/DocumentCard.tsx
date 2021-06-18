import React from 'react'
import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import BP from '~/utils/breakpoints'
import Card from './Card'
import {
  CardBody,
  CardContainer,
  CARD_HORIZONTAL_PADDING,
} from './CardStyledComponents'
import { ICardProps } from './types'

const DocumentCard: React.FC<ICardProps> = ({
  id,
  type,
  mandatoryFields,
  optionalFields,
  photo,
  highlight,
}) => {
  return (
    <CardContainer testID="document-card">
      <Card
        id={id}
        type={type}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        photo={photo}
        highlight={highlight}
      >
        <Card.Dots
          customStyles={{
            top: CARD_HORIZONTAL_PADDING / 2,
            right: CARD_HORIZONTAL_PADDING / 2,
            zIndex: 10,
          }}
        />

        <DocumentCardMedium>
          <CardBody
            customStyles={{ paddingTop: BP({ default: 20, xsmall: 18 }) }}
          >
            <Card.DocumentHeader />
            <Card.OptionalFields />
          </CardBody>
          <Card.Highlight />
          <Card.Photo />
        </DocumentCardMedium>
      </Card>
    </CardContainer>
  )
}

export default DocumentCard
