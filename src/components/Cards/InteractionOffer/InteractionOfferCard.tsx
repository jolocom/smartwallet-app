import React from 'react'
import { StyleSheet } from 'react-native'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import InteractionCardOther from '~/assets/svg/InteractionCardOther'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'
import { commonStyles } from '../commonStyles'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'
import {
  ORIGINAL_DOCUMENT_OFFER_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_OFFER_CARD_WIDTH,
} from './consts'
import { CardType, InteractionOfferCardProps } from './types'

export const InteractionOfferCard: React.FC<
  InteractionOfferCardProps & CardType
> = ({ cardType, credentialName, fields }) => {
  const { t } = useTranslation()
  const Card =
    cardType === 'document' ? InteractionCardDoc : InteractionCardOther
  return (
    <ScaledCard
      originalWidth={ORIGINAL_DOCUMENT_OFFER_CARD_WIDTH}
      originalHeight={ORIGINAL_DOCUMENT_OFFER_CARD_HEIGHT}
      scaleToFit
    >
      <Card>
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
              <>
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
              </>
            ))
          ) : (
            <ScaledText
              scaleStyle={commonStyles.fieldLabelSmall}
              style={commonStyles.regularText}
            >
              {t('CredentialOffer.cardNoPreview')}
            </ScaledText>
          )}
        </ScaledView>
      </Card>
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
})
