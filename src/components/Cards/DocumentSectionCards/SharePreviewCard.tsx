import { DisplayVal } from '@jolocom/sdk/js/credentials'
import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import InteractionCardDoc from '~/assets/svg/InteractionCardDoc'
import { TextLayoutEvent } from '~/types/props'
import { Colors } from '~/utils/colors'
import { commonStyles } from '../commonStyles'
import { useCalculateFieldLines } from '../hooks'
import ScaledCard, { ScaledText, ScaledView } from '../ScaledCard'

import { DocumentHeader, SelectedToggle } from './components'
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
}

export const SharePreviewCard: React.FC<Props> = ({
  credentialName,
  holderName,
  fields,
  photo,
  selected,
  issuerIcon,
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

  const { fieldLines, handleFieldValueLayout } = useCalculateFieldLines()

  const handleFieldValuesVisibility = (child: React.ReactNode, idx: number) => {
    if (idx + 1 > MAX_FIELD_SHARE_CARD) {
      /* 1. Do not display anything that is more than max */
      return null
    }
    return child
  }

  const handleNumberOfValueLinesToDisplay = (idx: number) =>
    idx !== 0 ? (fieldLines[0] > 1 ? 1 : 2) : 2

  return (
    <ScaledCard
      originalWidth={ORIGINAL_DOCUMENT_SHARE_CARD_WIDTH}
      originalHeight={ORIGINAL_DOCUMENT_SHARE_CARD_HEIGHT}
      style={{ overflow: 'hidden' }}
      scaleStyle={{ borderRadius: 13 }}
      scaleToFit
    >
      <InteractionCardDoc>
        <DocumentHeader
          name={credentialName}
          icon={issuerIcon}
          selected={selected}
        />
      </InteractionCardDoc>
    </ScaledCard>
  )
}

const styles = StyleSheet.create({})
