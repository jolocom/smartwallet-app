import { RouteProp, useRoute } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ScannerIcon } from '~/assets/svg'
import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useAusweisInteraction } from '../hooks'
import { AusweisBottomSheet } from '../styled'
import { AusweisStackParamList } from '../'
import { eIDScreens } from '../types'

export const AusweisScanner = ({ navigation }) => {
  const { dismissMode } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.AusweisScanner>>()
      .params
  const { checkIfScanned, cancelInteraction } = useAusweisInteraction()

  const handleDismiss = () => {
    if (dismissMode === 'back') {
      navigation.goBack()
    } else if (dismissMode === 'cancel') {
      cancelInteraction()
    } else {
      throw new Error(
        `There is no dismiss handler for ${dismissMode} (provided dismiss mode)`,
      )
    }
  }

  useEffect(() => {
    checkIfScanned().then(() => {
      handleDismiss()
    })
  }, [])

  return (
    <AusweisBottomSheet onDismiss={handleDismiss}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 24,
        }}
      >
        <JoloText kind={JoloTextKind.title} customStyles={{ marginBottom: 16 }}>
          Ready to Scan
        </JoloText>
        <ScannerIcon />
      </View>
      <Btn onPress={handleDismiss}>Cancel</Btn>
    </AusweisBottomSheet>
  )
}
