import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'

import JoloText from '~/components/JoloText'
import { useLoader } from '~/hooks/loader'
import { useReplaceWith } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { ScreenNames } from '~/types/screens'

const ClearIdentityBtn = () => {
  const agent = useAgent()
  const loader = useLoader()
  const replaceWith = useReplaceWith()

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
      },
      {},
      (err) => {
        if (!err) {
          // NOTE: re-mounting Loggedin stack so it fetches updated storage and
          // resets redux store for attributes and credentials
          replaceWith(ScreenNames.LoggedIn)
        }
      },
    )
  }

  const handlePress = async () => {
    Alert.alert(strings.CLEAR_IDENTITY_TITLE, strings.CLEAR_IDENTITY_MESSAGE, [
      {
        text: strings.CLEAR_IDENTITY_CANCEL,
        style: 'cancel',
      },
      {
        text: strings.CLEAR_IDENTITY_CONFIRM,
        onPress: clearIdentityData,
      },
    ])
  }

  return (
    <View style={styles.container}>
      <JoloText size={JoloTextSizes.mini}>
        {strings.CLEAR_IDENTITY_DETAILS}{' '}
        <JoloText
          size={JoloTextSizes.mini}
          onPress={handlePress}
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
