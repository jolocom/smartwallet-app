import { RouteProp, useRoute } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import { ScannerIcon } from '~/assets/svg'
import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { AusweisBottomSheet } from '../styled'
import { AusweisStackParamList } from '../'
import { eIDScreens } from '../types'
import { useGoBack } from '~/hooks/navigation'
import { CardInfo } from 'react-native-aa2-sdk/js/types'
import { aa2Module } from 'react-native-aa2-sdk'

export const AusweisScanner = () => {
  const { onDismiss } =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.AusweisScanner>>()
      .params
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

    return () => {
      aa2Module.resetHandlers()
    }
  }, [])

  const handleDismiss = () => {
    /**
     * NOTE:
     * delegating removing scanner from the
     * navigation stack to the scanner;
     * onDismiss should contain logic without closing
     * the AusweisScanner screen
     */
    goBack()
    onDismiss && onDismiss()
  }

  // useEffect(() => {
  //   checkIfScanned().then(() => {
  //     handleDismiss()
  //   })
  // }, [])

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
