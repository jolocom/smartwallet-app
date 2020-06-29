import React from 'react'
import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import { View, StyleSheet } from 'react-native'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'
import { strings } from '~/translations/strings'
import { useDispatch } from 'react-redux'
import {
  resetInteractionSheet,
  resetInteraction,
} from '~/modules/account/actions'
import { Colors } from '~/utils/colors'

interface PropsI {
  onSubmit: () => void
  ctaText: string
}

const InteractionFooter: React.FC<PropsI> = ({ onSubmit, ctaText }) => {
  const dispatch = useDispatch()

  const handleCancel = () => {
    dispatch(resetInteractionSheet())
    dispatch(resetInteraction())
  }

  return (
    <BtnGroup alignment={BtnsAlignment.horizontal}>
      <View style={[styles.container, { width: '70%', marginRight: 12 }]}>
        <Btn size={BtnSize.medium} onPress={onSubmit}>
          {ctaText}
        </Btn>
      </View>
      <View style={[styles.container, { width: '30%' }]}>
        <Btn
          size={BtnSize.medium}
          type={BtnTypes.secondary}
          onPress={handleCancel}
          customContainerStyles={styles.cancelBtn}
        >
          {strings.CANCEL}
        </Btn>
      </View>
    </BtnGroup>
  )
}

const styles = StyleSheet.create({
  cancelBtn: {
    borderWidth: 2,
    borderColor: Colors.borderGray20,
    borderRadius: 8,
    paddingVertical: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default InteractionFooter
