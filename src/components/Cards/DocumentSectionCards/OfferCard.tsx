import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import ScaledCard, { ScaledText } from '../ScaledCard'

import { DocumentFields, DocumentHeader } from './components'
import {
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'

interface Props {
  credentialName: string
  issuerIcon?: string
  fields: Array<DisplayVal>
  selected?: boolean
  style?: StyleProp<ViewStyle>
}

const OfferCard: React.FC<Props> = ({
  credentialName,
  fields,
  selected,
  issuerIcon,
  style = {},
}) => {
  const { t } = useTranslation()
  const maxRows = 3
  const [nrDisplayedFields, setNrDisplayFields] = useState(fields.length)

  const handleDisplayedFields = (fields: DisplayVal[]) => {
    setNrDisplayFields(fields.length)
  }

  const nrLeftFields = fields.length - nrDisplayedFields

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
        />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <DocumentFields
                fields={fields}
                maxRows={maxRows}
                maxLines={1}
                rowDistance={8}
                fieldCharacterLimit={12}
                labelScaledStyle={{ fontSize: 14, lineHeight: 18 }}
                valueScaledStyle={{
                  fontSize: 18,
                  lineHeight: 20,
                  height: 20,
                  borderRadius: 5,
                  backgroundColor: Colors.alto,
                }}
                nrOfColumns={2}
                onFinishCalculation={handleDisplayedFields}
                allowOverflowingFields={false}
              />
            </View>
          </View>
          <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
            {!!nrLeftFields && (
              <ScaledText
                style={{
                  fontFamily: Fonts.Regular,
                  color: Colors.slateGray,
                }}
                scaleStyle={{
                  fontSize: 14,
                  lineHeight: 18,
                  marginBottom: 32,
                  bordereRadius: 5,
                }}
              >
                {t('CredentialOffer.nrOfFieldsLeft', { nr: nrLeftFields })}
              </ScaledText>
            )}
          </View>
        </View>
      </View>
    </ScaledCard>
  )
}

export default OfferCard
