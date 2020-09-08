import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import BtnGroup, { BtnsAlignment } from '~/components/BtnGroup'
import Btn, { BtnTypes, BtnSize } from '~/components/Btn'

import { resetInteraction } from '~/modules/interaction/actions'
import { getIsFullScreenInteraction } from '~/modules/interaction/selectors'

import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { useHandleFlowSubmit } from '~/hooks/interactions/useHandleFlowSubmit'

import AbsoluteBottom from '~/components/AbsoluteBottom'
import useInteractionCta from './hooks/useInteractionCta'
import { useLoader } from '~/hooks/useLoader'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'

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

interface Props {
  disabled?: boolean
}

const InteractionFooter: React.FC<Props> = ({ disabled }) => {
  const dispatch = useDispatch()
  const interactionCTA = useInteractionCta()
  const handleFlowSubmit = useHandleFlowSubmit()
  const loader = useLoader()
  const {
    getSingleMissingAttribute,
    handleCreateAttribute,
  } = useCredentialShareFlow()

  const handleSubmit = async () => {
    await loader(
        async () => {
          const missingAttribute = getSingleMissingAttribute()
          if (missingAttribute) {
            handleCreateAttribute(missingAttribute)
          } else {
            await handleFlowSubmit()
          }
        },
        { showFailed: false, showSuccess: false },
    )
  }

  const handleCancel = () => {
    dispatch(resetInteraction())
  }

  return (
    <FooterContainer>
      <BtnGroup alignment={BtnsAlignment.horizontal}>
        <View style={[styles.btnContainer, { flex: 0.7, marginRight: 12 }]}>
          <Btn disabled={disabled} size={BtnSize.medium} onPress={handleSubmit}>
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
