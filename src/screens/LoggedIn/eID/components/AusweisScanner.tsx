import { useRoute } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { CardInfo } from 'react-native-aa2-sdk/js/types'

import { ScannerIcon } from '~/assets/svg'

import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'

import { useGoBack } from '~/hooks/navigation'

import { AusweisBottomSheet } from '../styled'

/**
 * TODO:
 * Scanner on Android needs a message with a big letters
 * saying "dont remove the card until the scanner popup is gone"
 */
export const AusweisScanner = ({ navigation }) => {
  const { onDismiss } = useRoute().params
  const goBack = useGoBack()

  useEffect(() => {
    aa2Module.setHandlers({
      /**
       * NOTE: hide scanner as soon
       * as the READER msg was received
       */
      handleCardInfo: (card: CardInfo | null) => {
        if (card !== null) {
          goBack()
        }
      },
    })
  }, [])

  const handleDismiss = () => {
    onDismiss && onDismiss()
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
