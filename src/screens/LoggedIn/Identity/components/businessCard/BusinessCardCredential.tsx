import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors } from '~/utils/colors';
import {getGroupedValuesForBusinessCard} from '~/modules/attributes/selectors'
import BusinessCard from '../../IdentityBusinessCard';
import { ClaimKeys, IAttributeClaimFieldWithValue } from '~/types/credentials';
import { strings } from '~/translations';

const findClaimValueForKey = (fields: IAttributeClaimFieldWithValue[]) => (key: ClaimKeys) => fields.find(f => f.key === key)?.value;

const BusinessCardCredential: React.FC = () => {
  const groupedValuesBC = useSelector(getGroupedValuesForBusinessCard);
  if (!groupedValuesBC) return null

  const { fields } = groupedValuesBC;
  const getClaimValue = findClaimValueForKey(fields);
  const displayedName = `${getClaimValue(ClaimKeys.givenName)} ${getClaimValue(ClaimKeys.familyName)}`;

  return (
    <>
      <View>
        <BusinessCard.Styled.Title color={Colors.white}>
          {displayedName}
        </BusinessCard.Styled.Title>
        <BusinessCard.Styled.FieldGroup customStyles={{ marginTop: 3 }}>
          <BusinessCard.Styled.FieldName>
            {strings.COMPANY}
          </BusinessCard.Styled.FieldName>
          <BusinessCard.Styled.FieldValue color={Colors.white}>
            {getClaimValue(ClaimKeys.legalCompanyName)}
          </BusinessCard.Styled.FieldValue>
        </BusinessCard.Styled.FieldGroup>
      </View>
      <BusinessCard.Styled.FieldGroup customStyles={{ marginTop: 3 }}>
        <BusinessCard.Styled.FieldName>
          {strings.CONTACT_ME}
        </BusinessCard.Styled.FieldName>
        {/* TODO: don't display empty claims */}
        <BusinessCard.Styled.FieldValue color={Colors.white}>
          { getClaimValue(ClaimKeys.email)}
        </BusinessCard.Styled.FieldValue>
        <BusinessCard.Styled.FieldValue color={Colors.white}>
          { getClaimValue(ClaimKeys.telephone)}
        </BusinessCard.Styled.FieldValue>
      </BusinessCard.Styled.FieldGroup>
    </>
  )
}

export default BusinessCardCredential