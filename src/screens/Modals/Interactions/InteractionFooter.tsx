import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import { resetInteraction } from '~/modules/interaction/actions'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { useHandleFlowSubmit } from '~/hooks/credentials'
import useInteractionCta from './hooks/useInteractionCta'

interface PropsI {
  customCTA?: string
}

const InteractionFooter: React.FC<PropsI> = ({ customCTA }) => {
  const dispatch = useDispatch()
  const handleFlowSubmit = useHandleFlowSubmit()
  const interactionCta = useInteractionCta()

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  const handleSubmit = () => {
    handleFlowSubmit()
  }

  return (
    <BtnGroup alignment={BtnsAlignment.horizontal}>
      <View style={[styles.container, { width: '70%', marginRight: 12 }]}>
        <Btn size={BtnSize.medium} onPress={handleSubmit}>
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
