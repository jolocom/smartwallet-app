import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { useRecoveryState } from './module/recoveryContext'
import JoloText, { JoloTextKind } from '~/components/JoloText'

interface RecoveryInputMetadataI {
  keyHasError: boolean
}

const RecoveryInputMetadata: React.FC<RecoveryInputMetadataI> = memo(
  ({ keyHasError }) => {
    return (
      <View style={styles.inputMeta}>
        {keyHasError ? (
          <JoloText
            kind={JoloTextKind.subtitle}
            size="middle"
            color={Colors.error}
          >
            {strings.CANT_MATCH_WORD}
          </JoloText>
        ) : (
          <JoloText kind={JoloTextKind.subtitle} size="middle">
            {strings.WHAT_IF_I_FORGOT}
          </JoloText>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  inputMeta: {
    marginTop: 15,
  },
})

export default function () {
  // extracting only keyHasError property from the context to avoid unnecessary re-renders
  const { keyHasError } = useRecoveryState()
  return <RecoveryInputMetadata keyHasError={keyHasError} />
}
