import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations'
import { sharedStyles } from './sharedStyle'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'

type InteractionOfferDocumentCardProps = {
  credentialName: string
  fields: Array<Required<Pick<DisplayVal, 'label'>>>
}

/**
 * TODO:
 * - View with padding-bottom transform to Space component
 */
export const InteractionOfferDocumentCard: React.FC<InteractionOfferDocumentCardProps> =
  ({ credentialName, fields }) => (
    <InteractionCardDoc>
      <View style={styles.documentBodyContainer}>
        <Text style={[sharedStyles.regularText, styles.credentialName]}>
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
    </InteractionCardDoc>
  )

type InteractionOfferOtherCardProps = {
  credentialName: string
  fields: Array<Required<Pick<DisplayVal, 'label'>>>
}

// TODO: ask Liz to make available paddings for other card
// label size is different in other and document is it intentional ?

// TODO: this is very similar to document card - abstract
export const InteractionOfferOtherCard: React.FC<InteractionOfferOtherCardProps> =
  ({ credentialName, fields }) => (
    <InteractionCardOther>
      <View style={styles.otherBodyContainer}>
        <Text style={[sharedStyles.regularText, styles.credentialName]}>
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
    </InteractionCardOther>
  )

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
