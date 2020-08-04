import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import { resetInteraction } from '~/modules/interaction/actions'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import useInteractionCta from './hooks/useInteractionCta'

interface PropsI {
  onSubmit: () => void
  customCTA?: string
}

const InteractionFooter: React.FC<PropsI> = ({ onSubmit, customCTA }) => {
  const dispatch = useDispatch()
  const interactionCta = useInteractionCta()

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <BtnGroup alignment={BtnsAlignment.horizontal}>
      <View style={[styles.container, { width: '70%', marginRight: 12 }]}>
        <Btn size={BtnSize.medium} onPress={onSubmit}>
          {customCTA || interactionCta}
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
