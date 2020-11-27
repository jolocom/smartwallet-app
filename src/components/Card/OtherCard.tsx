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
            <Card.OptionalFields customStyles={{ paddingHorizontal: 8 }} />
            <Card.Dots
              customStyles={{ position: 'absolute', bottom: 25, right: 25 }}
            />
          </CardBody>
        </Card>
      </OtherCardMedium>
    </CardContainer>
  )
}

export default OtherCard
