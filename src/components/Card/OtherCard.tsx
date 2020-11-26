import React from 'react'
import DocumentCardMedium from '~/assets/svg/DocumentCardMedium'
import Card from './Card'

const OtherCard = ({ mandatoryFields, preferredFields }) => {
  return (
    <CardContainer>
      <DocumentCardMedium>
        <Card>
          <Card.MandatoryFields />
          <Card.OptionalFields />
        </Card>
      </DocumentCardMedium>
    </CardContainer>
  )
}

export default OtherCard
