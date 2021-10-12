import React from 'react'
import { View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import ScreenContainer from '~/components/ScreenContainer'

export const AusweisPasscodeDetails = () => {
  const handlePasscodeSettings = () => {
    //TODO: implement
    console.warn('Not implemented')
  }

  return (
    <ScreenContainer hasHeaderClose>
      <ScreenContainer.Header customStyles={{ alignSelf: 'center' }}>
        Info about six digit pin
      </ScreenContainer.Header>
      <View style={{ flex: 1 }}></View>
      <BtnGroup>
        <Btn type={BtnTypes.quinary} onPress={handlePasscodeSettings}>
          Pin settings
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}
