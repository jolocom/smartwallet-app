import React from 'react'
import { View } from 'react-native'
import OtherCardMedium from '~/assets/svg/OtherCardMedium'
import BP from '~/utils/breakpoints'
import Card from './Card'
import {
  CardBody,
  CardContainer,
  CARD_HORIZONTAL_PADDING,
} from './CardStyledComponents'
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
          <View
            style={{
              paddingTop: BP({ default: 20, xsmall: 18 }),
            }}
          >
            <CardBody>
              <View style={{ flex: 0.26 }}>
                <Card.OtherHeader />
              </View>

              <View
                style={{
                  flex: 0.74,
                  marginTop: BP({ default: 20, xsmall: 0 }),
                }}
              >
                <Card.OptionalFields
                  customStyles={{
                    paddingHorizontal: BP({ default: 8, xsmall: 0 }),
                  }}
                />
              </View>
            </CardBody>
          </View>
        </Card>
      </OtherCardMedium>
      <Card.Dots
        customStyles={{
          bottom: CARD_HORIZONTAL_PADDING / 3,
          right: CARD_HORIZONTAL_PADDING / 2,
        }}
      />
    </CardContainer>
  )
}

export default OtherCard
