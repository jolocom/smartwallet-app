import React from 'react'
import { StyleSheet } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations'
import { sharedStyles } from './sharedStyle'
import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import ScaledCard, { ScaledText, ScaledView } from './ScaledCard'

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
    <ScaledCard originalWidth={368} originalHeight={232} scaleToFit>
      <Card>
        <ScaledView scaleStyle={styles.bodyContainer}>
          <ScaledText
            numberOfLines={1}
            scaleStyle={styles.credentialName}
            style={sharedStyles.regularText}
          >
            {credentialName}
          </ScaledText>
          <ScaledView scaleStyle={{ paddingBottom: 16 }} />
          <ScaledText
            scaleStyle={styles.fieldSectionTitle}
            style={sharedStyles.regularText}
          >
            {strings.INCLUDED_INFO}:
          </ScaledText>
          <ScaledView scaleStyle={{ paddingBottom: 11 }} />
          {fields.length ? (
            fields.slice(0, 3).map((f, idx) => (
              <>
                {idx !== 0 && <ScaledView scaleStyle={{ paddingBottom: 10 }} />}
                <ScaledText
                  scaleStyle={sharedStyles.fieldLabelSmall}
                  style={sharedStyles.regularText}
                >
                  {f.label}
                </ScaledText>
                <ScaledView scaleStyle={{ paddingBottom: 0.5 }} />
                <ScaledView
                  scaleStyle={styles.valuePlaceholder}
                  style={{ opacity: 0.57 }}
                />
              </>
            ))
          ) : (
            <ScaledText
              scaleStyle={sharedStyles.fieldLabelSmall}
              style={sharedStyles.regularText}
            >
              {strings.NO_INFO_THAT_CAN_BE_PREVIEWED}
            </ScaledText>
          )}
        </ScaledView>
      </Card>
    </ScaledCard>
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
  bodyContainer: {
    paddingBottom: 21,
    paddingTop: 16,
    paddingHorizontal: 14,
  },
  valuePlaceholder: {
    width: '45.8%',
    height: 20,
    borderRadius: 5,
    backgroundColor: Colors.alto,
  },
})
