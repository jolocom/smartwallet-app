import React, { useState } from 'react'
import ActionSheet from './ActionSheet/ActionSheet'
import { Colors } from '~/utils/colors'
import { View, StyleSheet } from 'react-native'
import AbsoluteBottom from './AbsoluteBottom'
import Btn, { BtnTypes } from './Btn'
import JoloText, { JoloTextKind } from './JoloText'
import { debugView } from '~/utils/dev'

interface Props {
  isVisible: boolean
  title: string
  closeBtnText: string
  onClose: () => void
}

const InfoActionSheet: React.FC<Props> = ({
  children,
  title,
  closeBtnText,
  isVisible,
  onClose,
}) => {
  return (
    <ActionSheet
      isVisible={isVisible}
      overlayColor={Colors.black}
      animationType={'fade'}
      testID="info-action-sheet"
    >
      <View style={styles.container}>
        <JoloText
          kind={JoloTextKind.title}
          color={Colors.white85}
          customStyles={{ textAlign: 'left' }}
        >
          {title}
        </JoloText>
        <View
          style={{
            marginTop: 36,
          }}
        >
          <JoloText color={Colors.white} customStyles={{ textAlign: 'left' }}>
            {children}
          </JoloText>
        </View>
      </View>
      <AbsoluteBottom>
        <Btn type={BtnTypes.secondary} onPress={onClose}>
          {closeBtnText}
        </Btn>
      </AbsoluteBottom>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    flex: 1,
    paddingBottom: '20%',
  },
})

export default InfoActionSheet
