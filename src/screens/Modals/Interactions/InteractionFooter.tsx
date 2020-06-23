import React from 'react'
import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import { View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'
import { strings } from '~/translations/strings'

interface PropsI {
  hideActionSheet: () => void
  ctaText: string
}

const InteractionFooter: React.FC<PropsI> = ({ hideActionSheet, ctaText }) => {
  return (
    <BtnGroup alignment={BtnsAlignment.horizontal}>
      <View style={{ width: '70%' }}>
        <Btn onPress={() => {}}>{ctaText}</Btn>
      </View>
      <View style={{ width: '30%' }}>
        <Btn type={BtnTypes.secondary} onPress={hideActionSheet}>
          {strings.CANCEL}
        </Btn>
      </View>
    </BtnGroup>
  )
}

export default InteractionFooter
