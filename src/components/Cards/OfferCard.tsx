import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import ScaledCard, { ScaledText } from './ScaledCard'

import { DocumentProperty, Document } from '~/hooks/documents/types'
import { DocumentFields, DocumentHeader } from './components'
import {
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'

interface Props {
  credentialName: string
  styles: Document['style']
  issuerIcon?: string
  fields: Omit<DocumentProperty, 'value'>[]
  numberOfFields: number
  selected?: boolean
  style?: StyleProp<ViewStyle>
}

const OfferCard: React.FC<Props> = ({
  credentialName,
  fields,
  selected,
  issuerIcon,
  numberOfFields,
  styles,
  style = {},
}) => {
  const { t } = useTranslation()
  const maxRows = 3
  const [nrDisplayedFields, setNrDisplayFields] = useState(fields.length)

  const handleDisplayedFields = (fields: DocumentProperty[]) => {
    setNrDisplayFields(fields.length)
  }

  const nrLeftFields = numberOfFields - nrDisplayedFields

  return (
    <ScaledCard
      originalWidth={ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH}
      originalHeight={ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT}
      style={[{ overflow: 'hidden', backgroundColor: Colors.white }, style]}
      scaleStyle={{ borderRadius: 13 }}
      scaleToFit
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <DocumentHeader
          name={credentialName}
          icon={issuerIcon}
          selected={selected}
          backgroundColor={styles.backgroundColor}
          backgroundImage={styles.backgroundImage}
          isInteracting={true}
        />
        <View style={{ flexDirection: 'row', flex: 1, marginTop: 4 }}>
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', flex: 1 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <DocumentFields
                  fields={fields}
                  maxRows={maxRows}
                  maxLines={1}
                  rowDistance={4}
                  fieldCharacterLimit={12}
                  labelScaledStyle={{ fontSize: 14, lineHeight: 18 }}
                  valueScaledStyle={{
                    fontSize: 18,
                    lineHeight: 20,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: Colors.alto,
                    // NOTE: without this iOS doesn't apply the borderRadius (for text)
                    overflow: 'hidden',
                  }}
                  nrOfColumns={2}
                  onFinishCalculation={handleDisplayedFields}
                  allowOverflowingFields={true}
                  hideFieldValues={true}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingHorizontal: 8,
                paddingBottom: 4,
              }}
            >
              {Boolean(nrLeftFields) && (
                <ScaledText
                  style={{
                    fontFamily: Fonts.Regular,
                    color: Colors.slateGray,
                  }}
                  scaleStyle={{
                    fontSize: 14,
                    lineHeight: 18,
                  }}
                >
                  {t('CredentialOffer.nrOfFieldsLeft', { nr: nrLeftFields })}
                </ScaledText>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScaledCard>
  )
}

export default OfferCard
