import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'

import { Colors } from '~/utils/colors'
import { strings } from '~/translations/strings'
import { useRecoveryState } from './module/recoveryContext'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'

interface RecoveryInputMetadataI {
  keyHasError: boolean
}

const RecoveryInputMetadata: React.FC<RecoveryInputMetadataI> = memo(
  ({ keyHasError }) => {
    const redirect = useRedirect()

    return (
      <View style={styles.inputMeta}>
        {keyHasError ? (
          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            color={Colors.error}
          >
            {strings.CANT_MATCH_WORD}
          </JoloText>
        ) : (
          <JoloText
            onPress={() =>
              redirect(ScreenNames.GlobalModals, {
                screen: ScreenNames.LostSeedPhraseInfo,
              })
            }
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            color={Colors.white}
          >
            {strings.WHAT_IF_I_FORGOT}
          </JoloText>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  inputMeta: {
    marginTop: BP({ default: 15, xsmall: 7 }),
  },
})

export default function () {
  // extracting only keyHasError property from the context to avoid unnecessary re-renders
  const { keyHasError, suggestedKeys } = useRecoveryState()
  return (
    <RecoveryInputMetadata keyHasError={keyHasError && !suggestedKeys.length} />
  )
}
