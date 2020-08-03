import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import { resetInteraction } from '~/modules/interaction/actions'
import { getInteractionType } from '~/modules/interaction/selectors'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'

import getCTAText from './utils/getCTAText'

interface PropsI {
  onSubmit: () => void
  customCTA?: string
}

const InteractionFooter: React.FC<PropsI> = ({ onSubmit, customCTA }) => {
  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <BtnGroup alignment={BtnsAlignment.horizontal}>
      <View style={[styles.container, { flex: 0.7, marginRight: 12 }]}>
        <Btn size={BtnSize.medium} onPress={onSubmit}>
          {customCTA || getCTAText(interactionType)}
        </Btn>
      </View>
      <View style={[styles.container, { flex: 0.3 }]}>
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
  },
})

export default InteractionFooter
