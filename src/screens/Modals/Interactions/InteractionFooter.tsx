import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import { resetInteraction } from '~/modules/interaction/actions'
import {
  getInteractionType,
  getIsFullScreenInteraction,
} from '~/modules/interaction/selectors'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'

import getCTAText from './utils/getCTAText'
import AbsoluteBottom from '~/components/AbsoluteBottom'

const FooterContainer: React.FC = ({ children }) => {
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)
  if (isFullScreenInteraction) {
    return (
      <AbsoluteBottom customStyles={styles.FASfooter}>
        <View style={styles.FAScontainer}>{children}</View>
      </AbsoluteBottom>
    )
  }
  return <View>{children}</View>
}

const InteractionFooter: React.FC = () => {
  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)

  const handleSubmit = () => {
    // TODO: add logic for different interaction types
  }

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <FooterContainer>
      <BtnGroup alignment={BtnsAlignment.horizontal}>
        <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
          <Btn size={BtnSize.medium} onPress={handleSubmit}>
            {getCTAText(interactionType)}
          </Btn>
        </View>
        <View style={[styles.btnContainer, { flex: 0.3 }]}>
          <Btn
            size={BtnSize.medium}
            type={BtnTypes.secondary}
            onPress={handleCancel}
            customContainerStyles={styles.cancelBtn}
          >
            {strings.IGNORE}
          </Btn>
        </View>
      </BtnGroup>
    </FooterContainer>
  )
}

const styles = StyleSheet.create({
  FAScontainer: {
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FASfooter: {
    bottom: 0,
    height: 106,
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
  btnContainer: {
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
