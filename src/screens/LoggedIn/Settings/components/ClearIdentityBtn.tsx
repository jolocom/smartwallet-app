import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import JoloText from '~/components/JoloText'
import { useLoader } from '~/hooks/loader'
import { useRedirect } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

const ClearIdentityBtn = () => {
  const agent = useAgent()
  const loader = useLoader()
  const redirect = useRedirect()

  const handlePress = async () => {
    Alert.alert(strings.CLEAR_IDENTITY_TITLE, strings.CLEAR_IDENTITY_MESSAGE, [
      {
        text: strings.CLEAR_IDENTITY_CONFIRM,
        onPress: () => {
          loader(
            async () => {
              await agent.delete({ identity: false, encryptedWallet: false })
            },
            {},
            (err) => {
              if (!err) {
                redirect(ScreenNames.Identity)
              }
            },
          )
        },
      },
      {
        text: strings.CLEAR_IDENTITY_CANCEL,
        style: 'cancel',
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
    marginTop: 44,
    paddingHorizontal: 12,
  },
})

export default ClearIdentityBtn
