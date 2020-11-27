import React from 'react'
import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import Card from './Card'
import { CardBody, CardContainer } from './CardStyledComponents'

const OtherCard = ({ mandatoryFields, preferredFields, image }) => {
  return (
    <CardContainer>
      <OtherCardMedium>
        <Card
          mandatoryFields={mandatoryFields}
          preferredFields={preferredFields}
          image={image}
        >
          <CardBody>
            <Card.OtherHeader />
            <Card.OptionalFields />
          </CardBody>
        </Card>
      </OtherCardMedium>
    </CardContainer>
  )
}

export default OtherCard
