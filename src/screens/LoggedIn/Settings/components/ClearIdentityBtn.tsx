import React, { useEffect, useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { useIsFocused } from '@react-navigation/core'

import JoloText from '~/components/JoloText'
import { useLoader } from '~/hooks/loader'
import { useReplaceWith } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { fonts, JoloTextSizes } from '~/utils/fonts'
import { ScreenNames } from '~/types/screens'
import Dialog from 'react-native-dialog'

const ClearIdentityBtn = () => {
  const agent = useAgent()
  const loader = useLoader()
  const replaceWith = useReplaceWith()
  const [shouldShowAndroidDialog, setShowAndroidDialog] = useState(false)
  const isFocused = useIsFocused()

  const hideAndroidDialog = () => {
    setShowAndroidDialog(false)
  }

  const showAndroidDialog = () => {
    setShowAndroidDialog(true)
  }

  useEffect(() => {
    if (!isFocused) hideAndroidDialog()
  }, [isFocused])

  const clearIdentityData = () => {
    loader(
      async () => {
        await agent.delete({ identity: false, encryptedWallet: false })
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

  const showIosDialog = () => {
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

  const renderAndroidDialog = () => (
    <Dialog.Container
      visible={shouldShowAndroidDialog}
      onBackdropPress={hideAndroidDialog}
    >
      <Dialog.Title
        // @ts-ignore for some reason they gave a @Text component @ViewStyle props.
        style={{ ...fonts.title.middle.medium, color: Colors.black }}
      >
        {strings.CLEAR_IDENTITY_TITLE}
      </Dialog.Title>
      <Dialog.Description
        // @ts-ignore for some reason they gave a @Text component @ViewStyle props
        style={{ ...fonts.subtitle.middle.medium, color: Colors.black65 }}
      >
        {strings.CLEAR_IDENTITY_MESSAGE}
      </Dialog.Description>
      <Dialog.Button
        label={strings.CLEAR_IDENTITY_CANCEL}
        onPress={hideAndroidDialog}
        color={Colors.success}
        style={{ opacity: 0.8 }}
      />
      <Dialog.Button
        label={strings.CLEAR_IDENTITY_CONFIRM}
        onPress={clearIdentityData}
        color={Colors.success}
        style={{ opacity: 0.8 }}
      />
    </Dialog.Container>
  )

  const handlePress = () => {
    if (Platform.OS === 'ios') showIosDialog()
    else showAndroidDialog()
  }

  return (
    <>
      {renderAndroidDialog()}
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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
})

export default ClearIdentityBtn
