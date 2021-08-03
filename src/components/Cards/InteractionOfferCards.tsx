import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations'
import { sharedStyles } from './sharedStyle'

type InteractionOfferDocumentCardProps = {
  credentialName: string
  fields: Array<Required<Pick<DisplayVal, 'label'>>>
}

/**
 * TODO:
 * - View with padding-bottom transform to Space component
 */
export const InteractionOfferDocumentCard: React.FC<InteractionOfferDocumentCardProps> =
  ({ credentialName, fields }) => {
    return (
      <InteractionCardDoc>
        <View style={styles.documentBodyContainer}>
          <Text
            style={[sharedStyles.regularText, styles.documentCredentialName]}
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
                  style={[
                    sharedStyles.regularText,
                    sharedStyles.fieldLabelSmall,
                  ]}
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
  }

const styles = StyleSheet.create({
  fieldSectionTitle: {
    fontSize: 16,
  },
  documentBodyContainer: {
    paddingBottom: 21,
    paddingTop: 16,
    paddingHorizontal: 14,
  },
  documentCredentialName: {
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: Colors.black80,
  },
  documentValuePlaceholder: {
    width: '45.8%',
    height: 20,
    borderRadius: 5,
    opacity: 0.57,
    backgroundColor: Colors.alto,
  },
})
