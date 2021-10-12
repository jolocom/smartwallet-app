import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ScannerIcon } from '~/assets/svg'
import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useGoBack } from '~/hooks/navigation'
import { useAusweisInteraction } from '../hooks'
import { AusweisBottomSheet } from '../styled'

export const AusweisScanner = () => {
  const goBack = useGoBack()
  const { checkIfScanned } = useAusweisInteraction()

  useEffect(() => {
    checkIfScanned().then(() => {
      handleDismiss()
    })
  }, [])

  const handleDismiss = () => {
    goBack()
  }

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
