import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'

import Paragraph from '~/components/Paragraph'
import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { useRecoveryState } from './module/recoveryContext'

interface RecoveryInputMetadataI {
  keyHasError: boolean
}

const RecoveryInputMetadata: React.FC<RecoveryInputMetadataI> = memo(
  ({ keyHasError }) => {
    return (
      <View style={styles.inputMeta}>
        {keyHasError ? (
          <Paragraph color={Colors.error}>{strings.CANT_MATCH_WORD}</Paragraph>
        ) : (
          <Paragraph>{strings.WHAT_IF_I_FORGOT}</Paragraph>
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
