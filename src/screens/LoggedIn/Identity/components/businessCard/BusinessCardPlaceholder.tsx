import React from 'react';
import { View } from 'react-native';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import BusinessCard from '../../IdentityBusinessCard';

const BusinessCardPlaceholder = () => {
  return (
    <>
      <View>
        <BusinessCard.Styled.Title color={Colors.white45}>
          {strings.YOUR_NAME}
        </BusinessCard.Styled.Title>
        <BusinessCard.Styled.FieldGroup customStyles={{ marginTop: 3 }}>
          <BusinessCard.Styled.FieldName>
            {strings.COMPANY}
          </BusinessCard.Styled.FieldName>
          <BusinessCard.Styled.FieldValue color={Colors.white21}>
            {strings.NOT_SPECIFIED}
          </BusinessCard.Styled.FieldValue>
        </BusinessCard.Styled.FieldGroup>
      </View>
      <BusinessCard.Styled.FieldGroup>
        <BusinessCard.Styled.FieldName>
          {strings.CONTACT_ME}
        </BusinessCard.Styled.FieldName>
        <BusinessCard.Styled.FieldValue color={Colors.white21}>
          {strings.NOT_SPECIFIED}
        </BusinessCard.Styled.FieldValue>
      </BusinessCard.Styled.FieldGroup>
    </>
  )
}

export default BusinessCardPlaceholder
