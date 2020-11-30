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
  mandatoryFields,
  optionalFields,
  image,
  highlight,
}) => {
  return (
    <CardContainer testID="document-card">
      <Card.Dots
        customStyles={{
          top: CARD_HORIZONTAL_PADDING / 2,
          right: CARD_HORIZONTAL_PADDING / 2,
          zIndex: 10,
        }}
      />
      <DocumentCardMedium>
        <Card
          id={id}
          mandatoryFields={mandatoryFields}
          optionalFields={optionalFields}
          image={image}
          highlight={highlight}
        >
          <CardBody
            customStyles={{ paddingTop: BP({ default: 20, xsmall: 18 }) }}
          >
            <Card.DocumentHeader />
            <Card.OptionalFields />
          </CardBody>
          <Card.Highlight />
          <Card.Photo />
        </Card>
      </DocumentCardMedium>
    </CardContainer>
  )
}

export default DocumentCard
