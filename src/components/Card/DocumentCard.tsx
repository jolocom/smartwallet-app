import React from 'react'
import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import Card from './Card'
import { CardBody, CardContainer } from './CardStyledComponents'
import { ICardProps } from './types'

const DocumentCard: React.FC<ICardProps> = ({
  mandatoryFields,
  optionalFields,
  image,
  highlight,
}) => {
  return (
    <CardContainer>
      <DocumentCardMedium>
        <Card
          mandatoryFields={mandatoryFields}
          optionalFields={optionalFields}
          image={image}
          highlight={highlight}
        >
          <CardBody>
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
