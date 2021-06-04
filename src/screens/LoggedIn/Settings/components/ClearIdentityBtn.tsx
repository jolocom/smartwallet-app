import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'

import JoloText from '~/components/JoloText'
import { useLoader } from '~/hooks/loader'
import { useReplaceWith } from '~/hooks/navigation'
import { useAgent, useWalletReset } from '~/hooks/sdk'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { ScreenNames } from '~/types/screens'

const ClearIdentityBtn = () => {
  const agent = useAgent()
  const loader = useLoader()
  const replaceWith = useReplaceWith()
  const resetWallet = useWalletReset()
  const navigation = useNavigation()

  const clearIdentityData = () => {
    loader(
      async () => {
        // NOTE: should delete interactions separately until multitenancy is there, due to
        // unfinished interactions not being deleted.
        await agent.storage.delete.interactions()
        await agent.delete({
          identity: false,
          encryptedWallet: false,
          interactions: false,
        })
        await resetWallet()
        replaceWith(ScreenNames.Main)
      },
      { loading: strings.CLEAR_IDENTITY_LOADER },
    )
  }

  const handleShowConfirmationScreen = () => {
    navigation.navigate(ScreenNames.DragToConfirm, {
      title: strings.CLEAR_IDENTITY_TITLE,
      cancelText: strings.CANCEL,
      onComplete: clearIdentityData,
    })
  }

  return (
    <View style={styles.container}>
      <JoloText size={JoloTextSizes.mini}>
        {strings.CLEAR_IDENTITY_DETAILS}{' '}
        <JoloText
          size={JoloTextSizes.mini}
          onPress={handleShowConfirmationScreen}
          color={Colors.success}
        >
          {strings.CLEAR_IDENTITY_BTN}
        </JoloText>
      </JoloText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
})

export default ClearIdentityBtn
