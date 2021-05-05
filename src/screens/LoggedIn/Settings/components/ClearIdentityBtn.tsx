import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'

import JoloText from '~/components/JoloText'
import { useLoader } from '~/hooks/loader'
import { useResetNavigation } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { resetAttrs } from '~/modules/attributes/actions'
import { resetCredentials } from '~/modules/credentials/actions'

const ClearIdentityBtn = () => {
  const agent = useAgent()
  const loader = useLoader()
  const resetNavigation = useResetNavigation()
  const dispatch = useDispatch()

  const clearIdentityData = () => {
    loader(
      async () => {
        await agent.delete({ identity: false, encryptedWallet: false })
      },
      {},
      (err) => {
        if (!err) {
          // NOTE: resetting navigation to unmount the @History tab, in case it
          // was previously mounted
          resetNavigation()

          // NOTE: resetting the credentials and attributes stores
          dispatch(resetAttrs())
          dispatch(resetCredentials())
        }
      },
    )
  }

  const handlePress = async () => {
    Alert.alert(strings.CLEAR_IDENTITY_TITLE, strings.CLEAR_IDENTITY_MESSAGE, [
      {
        text: strings.CLEAR_IDENTITY_CONFIRM,
        onPress: clearIdentityData,
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
