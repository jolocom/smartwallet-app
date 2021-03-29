import React from 'react'
import { View } from 'react-native'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import BusinessCardStyled from '../BusinessCardStyled'

const BusinessCardPlaceholder = () => {
  return (
    <>
      <View testID="business-card-placeholder">
        <BusinessCardStyled.Title color={Colors.white45}>
          {strings.YOUR_NAME}
        </BusinessCardStyled.Title>
        <BusinessCardStyled.FieldGroup customStyles={{ marginTop: 3 }}>
          <BusinessCardStyled.FieldName>
            {strings.COMPANY}
          </BusinessCardStyled.FieldName>
          <BusinessCardStyled.FieldValue color={Colors.white21}>
            {strings.NOT_SPECIFIED}
          </BusinessCardStyled.FieldValue>
        </BusinessCardStyled.FieldGroup>
      </View>
      <BusinessCardStyled.FieldGroup>
        <BusinessCardStyled.FieldName>
          {strings.CONTACT_ME}
        </BusinessCardStyled.FieldName>
        <BusinessCardStyled.FieldValue color={Colors.white21}>
          {strings.NOT_SPECIFIED}
        </BusinessCardStyled.FieldValue>
      </BusinessCardStyled.FieldGroup>
    </>
  )
}

export default BusinessCardPlaceholder
