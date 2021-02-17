import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { getBusinessCardConfigWithValues } from '~/modules/attributes/selectors'
import BusinessCardStyled from '../BusinessCardStyled'
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
        <BusinessCardStyled.Title color={Colors.white}>
          {displayedName}
        </BusinessCardStyled.Title>
        <BusinessCardStyled.FieldGroup customStyles={{ marginTop: 3 }}>
          <BusinessCardStyled.FieldName>
            {strings.COMPANY}
          </BusinessCardStyled.FieldName>
          <BusinessCardStyled.FieldValue color={Colors.white}>
            {getClaimValue(ClaimKeys.legalCompanyName)}
          </BusinessCardStyled.FieldValue>
        </BusinessCardStyled.FieldGroup>
      </View>
      <BusinessCardStyled.FieldGroup customStyles={{ marginTop: 3 }}>
        <BusinessCardStyled.FieldName>
          {strings.CONTACT_ME}
        </BusinessCardStyled.FieldName>
        {!!email && (
          <BusinessCardStyled.FieldValue color={Colors.white}>
            {email}
          </BusinessCardStyled.FieldValue>
        )}
        {!!telephone && (
          <BusinessCardStyled.FieldValue color={Colors.white}>
            {telephone}
          </BusinessCardStyled.FieldValue>
        )}
      </BusinessCardStyled.FieldGroup>
    </>
  )
}

export default BusinessCardCredential
