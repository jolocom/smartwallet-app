import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React, { useCallback, useState } from 'react'
import { Image, StyleProp, StyleSheet, View, ViewProps } from 'react-native'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'
import { commonStyles } from '../commonStyles'
import { useCalculateFieldLines } from '../hooks'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'

import {
  DocumentFields,
  DocumentHeader,
  DocumentHolderName,
  DocumentPhoto,
  DocumentShareField,
} from './components'
import {
  MAX_FIELD_SHARE_CARD,
  ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH,
} from './consts'

interface Props {
  credentialName: string
  issuerIcon?: string
  fields: Array<Required<DisplayVal>>
  selected?: boolean
  holderName?: string
  photo?: string
  style?: StyleProp<ViewProps>
}

export const SharePreviewCard: React.FC<Props> = ({
  credentialName,
  holderName,
  fields,
  photo,
  selected,
  issuerIcon,
  style = {},
}) => {
  /**
   * Logic to calculate number of lines a holder name takes
   * to decide how many fields can be displayed
   */
  const [holderNameLines, setHolderNameLines] = useState(0)

  const handleHolderNameLayout = (e: TextLayoutEvent) => {
    const lines = e.nativeEvent.lines.length
    setHolderNameLines(lines)
  }

  const renderField = (field: Required<DisplayVal>, idx: number) => {
    return <DocumentShareField field={field} idx={idx} />
  }

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
      <View style={{ flex: 1 }}>
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
                  <DocumentHolderName
                    name={holderName}
                    onLayout={handleHolderNameLayout}
                    numberOfLines={1}
                  />
                </View>
              )}
              <DocumentFields
                fields={fields}
                maxRows={maxRows}
                maxLines={1}
                renderField={renderField}
                rowDistance={8}
                fieldCharacterLimit={12}
              />
            </View>
            <View style={{ flex: 0.5 }}>
              {photo && <DocumentPhoto photo={photo} verticalPosition={-80} />}
            </View>
          </View>
        </View>
      </View>
    </ScaledCard>
  )
}

const styles = StyleSheet.create({})
