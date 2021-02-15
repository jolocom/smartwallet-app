import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { getBusinessCardConfigWithValues } from '~/modules/attributes/selectors'
import BusinessCard from '../../IdentityBusinessCard'
import { ClaimKeys, IAttributeClaimFieldWithValue } from '~/types/credentials'
import { strings } from '~/translations'

const findClaimValueForKey = (fields: IAttributeClaimFieldWithValue[]) => (
  key: ClaimKeys,
) => fields.find((f) => f.key === key)?.value

const BusinessCardCredential: React.FC = () => {
  const groupedValuesBC = useSelector(getBusinessCardConfigWithValues)
  if (!groupedValuesBC) return null

  const { fields } = groupedValuesBC
  const getClaimValue = findClaimValueForKey(fields)
  const displayedName = `${getClaimValue(ClaimKeys.givenName)} ${getClaimValue(
    ClaimKeys.familyName,
  )}`

  const email = getClaimValue(ClaimKeys.email)
  const telephone = getClaimValue(ClaimKeys.telephone)

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
        {!!email && (
          <BusinessCard.Styled.FieldValue color={Colors.white}>
            {email}
          </BusinessCard.Styled.FieldValue>
        )}
        {!!telephone && (
          <BusinessCard.Styled.FieldValue color={Colors.white}>
            {telephone}
          </BusinessCard.Styled.FieldValue>
        )}
      </BusinessCard.Styled.FieldGroup>
    </>
  )
}

export default BusinessCardCredential
