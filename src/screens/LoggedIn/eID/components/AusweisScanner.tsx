import React from 'react'
import { ScannerIcon } from '~/assets/svg'
import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useGoBack } from '~/hooks/navigation'
import { AusweisBottomSheet } from '../styled'

export const AusweisScanner = () => {
  const goBack = useGoBack()

  const handleDismiss = () => {
    goBack()
  }

  return (
    <AusweisBottomSheet onDismiss={handleDismiss}>
      <JoloText kind={JoloTextKind.title}>Ready to Scan</JoloText>
      <ScannerIcon />
      <Btn onPress={handleDismiss}>Cancel</Btn>
    </AusweisBottomSheet>
  )
}
