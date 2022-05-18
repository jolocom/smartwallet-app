import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React, { useCallback } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import ScaledCard from './ScaledCard'

import {
  DocumentFields,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
} from './components'
import {
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'

interface Props {
  credentialName: string
  issuerIcon?: string
  fields: Array<DisplayVal>
  selected?: boolean
  holderName?: string
  photo?: string
  style?: StyleProp<ViewStyle>
}

const ShareCard: React.FC<Props> = ({
  credentialName,
  holderName,
  fields,
  photo,
  selected,
  issuerIcon,
  style = {},
}) => {
  const calculateMaxRows = useCallback(() => {
    let maxRows = 3
    if (holderName) maxRows--

    return maxRows
  }, [holderName])

  const maxRows = calculateMaxRows()

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
            {holderName && (
              <View style={{ marginBottom: 12 }}>
                <DocumentHolderName name={holderName} numberOfLines={1} />
              </View>
            )}
            <DocumentFields
              fields={fields}
              maxRows={maxRows}
              maxLines={1}
              rowDistance={8}
              fieldCharacterLimit={12}
              labelScaledStyle={{ fontSize: 14, lineHeight: 18 }}
              valueScaledStyle={{ fontSize: 18, lineHeight: 20 }}
            />
          </View>
          <View style={{ flex: 0.5 }}>
            {photo && <DocumentPhoto photo={photo} verticalPosition={-80} />}
          </View>
        </View>
      </View>
    </ScaledCard>
  )
}

export default ShareCard
