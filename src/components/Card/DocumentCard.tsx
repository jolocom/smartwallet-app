import React from 'react'
import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import Card from './Card'
import { CardBody, CardContainer } from './CardStyledComponents'

const DocumentCard = ({
  mandatoryFields,
  preferredFields,
  image,
  highlight,
}) => {
  return (
    <CardContainer>
      <DocumentCardMedium>
        <Card
          mandatoryFields={mandatoryFields}
          preferredFields={preferredFields}
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
