import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import { resetInteraction } from '~/modules/interaction/actions'
import { getInteractionSheet } from '~/modules/interaction/selectors'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'

import getCTAText from './utils/getCTAText'

interface PropsI {
  onSubmit: () => void
  ctaText?: string
}

const InteractionFooter: React.FC<PropsI> = ({ onSubmit, ctaText }) => {
  const dispatch = useDispatch()

  const interactionType = useSelector(getInteractionSheet)

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <BtnGroup alignment={BtnsAlignment.horizontal}>
      <View style={[styles.container, { width: '70%', marginRight: 12 }]}>
        <Btn size={BtnSize.medium} onPress={onSubmit}>
          {ctaText || getCTAText(interactionType as FlowType)}
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: Colors.borderGray20,
    borderRadius: 8,
    paddingVertical: 10,
  },
})

export default InteractionFooter
