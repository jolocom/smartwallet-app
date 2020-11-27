import React from 'react'
import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import Card from './Card'
import { CardBody, CardContainer } from './CardStyledComponents'
import { ICardProps } from './types'

const OtherCard: React.FC<ICardProps> = ({
  mandatoryFields,
  optionalFields,
  image,
}) => {
  return (
    <CardContainer>
      <OtherCardMedium>
        <Card
          mandatoryFields={mandatoryFields}
          optionalFields={optionalFields}
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
