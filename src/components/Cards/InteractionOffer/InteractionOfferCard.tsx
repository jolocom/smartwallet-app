import React from 'react'
import { StyleSheet } from 'react-native'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'
import { commonStyles } from '../commonStyles'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import {
  ORIGINAL_DOCUMENT_OFFER_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_OFFER_CARD_WIDTH,
} from './consts'
import { InteractionOfferCardProps } from './types'

export const InteractionOfferCard: React.FC<InteractionOfferCardProps> = ({
  credentialName,
  fields,
}) => {
  const { t } = useTranslation()
  return (
    <ScaledCard
      originalWidth={ORIGINAL_DOCUMENT_OFFER_CARD_WIDTH}
      originalHeight={ORIGINAL_DOCUMENT_OFFER_CARD_HEIGHT}
      scaleToFit
    >
      <InteractionCardDoc>
        <ScaledView scaleStyle={styles.bodyContainer}>
          <ScaledText
            numberOfLines={1}
            scaleStyle={styles.credentialName}
            style={commonStyles.regularText}
          >
            {credentialName}
          </ScaledText>
          <ScaledView scaleStyle={{ paddingBottom: 16 }} />
          <ScaledText
            scaleStyle={styles.fieldSectionTitle}
            style={commonStyles.regularText}
          >
            {t('CredentialOffer.cardInfoHeader')}:
          </ScaledText>
          <ScaledView scaleStyle={{ paddingBottom: 11 }} />
          {fields.length ? (
            fields.slice(0, 3).map((f, idx) => (
              <React.Fragment key={`key-${f.label}`}>
                {idx !== 0 && <ScaledView scaleStyle={{ paddingBottom: 10 }} />}
                <ScaledText
                  numberOfLines={1}
                  scaleStyle={commonStyles.fieldLabelSmall}
                  style={commonStyles.regularText}
                >
                  {f.label}
                </ScaledText>
                <ScaledView scaleStyle={{ paddingBottom: 0.5 }} />
                <ScaledView
                  scaleStyle={styles.valuePlaceholder}
                  style={{ opacity: 0.57 }}
                />
              </React.Fragment>
            ))
          ) : (
            <ScaledText
              scaleStyle={commonStyles.fieldLabelSmall}
              style={[commonStyles.regularText, styles.preview]}
            >
              {t('CredentialOffer.cardNoPreview')}
            </ScaledText>
          )}
        </ScaledView>
      </InteractionCardDoc>
    </ScaledCard>
  )
}

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
  preview: {
    textAlign: 'left',
  },
})
