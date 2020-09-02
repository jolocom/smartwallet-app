import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import {
  resetInteraction,
  setIntermediaryState,
  setAttributeInputKey,
} from '~/modules/interaction/actions'
import {
  getIsFullScreenInteraction,
  getServiceIssuedCreds,
  getAttributeInputKey,
} from '~/modules/interaction/selectors'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { useHandleFlowSubmit } from '~/hooks/interactions/useHandleFlowSubmit'

import AbsoluteBottom from '~/components/AbsoluteBottom'
import { IntermediaryState } from '~/modules/interaction/types'
import useInteractionCta from './hooks/useInteractionCta'
import { useLoader } from '~/hooks/useLoader'
import { getShareAttributes } from '~/modules/attributes/selectors'

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
  const serviceIssuedCreds = useSelector(getServiceIssuedCreds)
  const attributesToShare = useSelector(getShareAttributes)
  const interactionCTA = useInteractionCta()
  const handleFlowSubmit = useHandleFlowSubmit()
  const loader = useLoader()
  const attributeInputKey = useSelector(getAttributeInputKey)

  // NOTE: for now this will alway return false because we don't set attributesToShare yet
  const showIntermediaryScreen =
    Object.keys(attributesToShare).length === 1 &&
    attributesToShare[Object.keys(attributesToShare)[0]] === [] &&
    serviceIssuedCreds.length === 0

  const handleSubmit = async () => {
    if (showIntermediaryScreen) {
      dispatch(setIntermediaryState(IntermediaryState.showing))
      dispatch(setAttributeInputKey(attributeInputKey))
    } else {
      await loader(
        async () => {
          await handleFlowSubmit()
        },
        { showFailed: false, showSuccess: false },
      )
    }
  }

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <FooterContainer>
      <BtnGroup alignment={BtnsAlignment.horizontal}>
        <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
          <Btn size={BtnSize.medium} onPress={handleSubmit}>
            {interactionCTA}
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
    borderRadius: 22,
    shadowColor: Colors.black30,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 7,
    shadowOpacity: 1,
    elevation: 10,
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
