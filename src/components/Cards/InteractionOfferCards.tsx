import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations'
import { sharedStyles } from './sharedStyle'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'

type InteractionOfferCardProps = {
  credentialName: string
  fields: Array<Required<Pick<DisplayVal, 'label'>>>
}
type CardType = {
  cardType: 'document' | 'other'
}

const OfferCard: React.FC<InteractionOfferCardProps & CardType> = ({
  cardType,
  credentialName,
  fields,
}) => {
  const Card =
    cardType === 'document' ? InteractionCardDoc : InteractionCardOther
  return (
    <Card>
      <View style={styles.documentBodyContainer}>
        <Text
          numberOfLines={1}
          style={[sharedStyles.regularText, styles.credentialName]}
        >
          {credentialName}
        </Text>
        <View style={{ paddingBottom: 16 }} />
        <Text style={[sharedStyles.regularText, styles.fieldSectionTitle]}>
          {strings.INCLUDED_INFO}:
        </Text>
        <View style={{ paddingBottom: 11 }} />
        {fields.length ? (
          fields.slice(0, 3).map((f, idx) => (
            <>
              {idx !== 0 && <View style={{ paddingBottom: 4 }} />}
              <Text
                style={[sharedStyles.regularText, sharedStyles.fieldLabelSmall]}
              >
                {f.label}
              </Text>
              <View style={{ paddingBottom: 0.5 }} />
              <View style={styles.documentValuePlaceholder} />
            </>
          ))
        ) : (
          <Text
            style={[sharedStyles.regularText, sharedStyles.fieldLabelSmall]}
          >
            {strings.NO_INFO_THAT_CAN_BE_PREVIEWED}
          </Text>
        )}
      </View>
    </Card>
  )
}

export const InteractionOfferDocumentCard: React.FC<InteractionOfferCardProps> =
  (props) => <OfferCard {...props} cardType="document" />
export const InteractionOfferOtherCard: React.FC<InteractionOfferCardProps> = (
  props,
) => <OfferCard {...props} cardType="other" />

const styles = StyleSheet.create({
  fieldSectionTitle: {
    fontSize: 16,
  },
  credentialName: {
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.black80,
  },
  documentBodyContainer: {
    paddingBottom: 21,
    paddingTop: 16,
    paddingHorizontal: 14,
  },

  documentValuePlaceholder: {
    width: '45.8%',
    height: 20,
    borderRadius: 5,
    opacity: 0.57,
    backgroundColor: Colors.alto,
  },
  otherBodyContainer: {
    // TODO: update once LIZ will provide values
    paddingBottom: 21,
    paddingTop: 16,
    paddingHorizontal: 14,
  },
})
