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
import Btn, { BtnTypes } from '~/components/Btn'
import { debugView } from '~/utils/dev'

interface RecoveryInputMetadataI {
  keyHasError: boolean
}

const RecoveryInputMetadata: React.FC<RecoveryInputMetadataI> = memo(
  ({ keyHasError }) => {
    const redirect = useRedirect()

    return (
      <View style={styles.inputMeta}>
        {keyHasError ? (
          <Btn
            type={BtnTypes.secondary}
            withoutMargins
            customContainerStyles={{ height: 'auto' }}
            onPress={() => {}}
            customTextStyles={{ color: Colors.error }}
            activeOpacity={1}
          >
            {strings.CANT_MATCH_WORD}
          </Btn>
        ) : (
          <Btn
            onPress={() =>
              redirect(ScreenNames.GlobalModals, {
                screen: ScreenNames.LostSeedPhraseInfo,
              })
            }
            type={BtnTypes.secondary}
            withoutMargins
            customContainerStyles={{ height: 'auto' }}
          >
            {strings.WHAT_IF_I_FORGOT}
          </Btn>
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
