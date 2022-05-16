import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React, { useCallback } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import ScaledCard from '../ScaledCard'

import { DocumentFields, DocumentHeader } from './components'
import {
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'

interface Props {
  credentialName: string
  issuerIcon?: string
  fields: Array<Required<DisplayVal>>
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
  const maxRows = 3

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
                width: '80%',
              }}
            />
          </View>
        </View>
      </View>
    </ScaledCard>
  )
}

export default OfferCard
