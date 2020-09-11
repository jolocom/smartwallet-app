import React, { useEffect, useRef, RefObject } from 'react'
import { View, StyleSheet, Dimensions, Platform } from 'react-native'
import ActionSheet, { ActionSheetProps } from 'react-native-actions-sheet'
import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'
import {
  CredentialShareBas,
  CredentialShareFas,
} from '~/screens/Modals/Interactions/CredentialShare'
import {
  CredentialOfferFas,
  CredentialOfferBas,
} from '~/screens/Modals/Interactions/CredentialOffer'

import {
  getInteractionType,
  getIsFullScreenInteraction,
  getIntermediaryState,
} from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import { resetInteraction } from '~/modules/interaction/actions'
import IntermediaryActionSheet from './IntermediaryActionSheet'
import { IntermediaryState } from '~/modules/interaction/types'
import { setIntermediaryState } from '~/modules/interaction/actions'
import InteractionIcon, { IconWrapper } from './InteractionIcon'
import Loader from '~/modals/Loader'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const ACTION_SHEET_PROPS: ActionSheetProps = {
  closeOnTouchBackdrop: true,
  footerHeight: 0,
  closeOnPressBack: false,
  elevation: 0,
}

const InteractionActionSheet: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null)
  const intermediarySheetRef = useRef<ActionSheet>(null)

  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)
  const intermediaryState = useSelector(getIntermediaryState)
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  useEffect(() => {
    if (interactionType) {
      // NOTE: RN doesn't support showing 2 modals at the same time, so we need a timeout
      // to assure the loader is hidden before starting to animate the ActionSheet.
      setTimeout(() => {
        actionSheetRef.current?.setModalVisible()
      }, 200)
    } else {
      actionSheetRef.current?.setModalVisible(false)
    }
  }, [interactionType])

  const replaceActionSheet = (
    initial: RefObject<ActionSheet>,
    next: RefObject<ActionSheet>,
  ) => {
    initial.current?.setModalVisible(false)
    setTimeout(() => {
      next.current?.setModalVisible(true)
    }, 300)
  }

  useEffect(() => {
    if (interactionType) {
      if (intermediaryState === IntermediaryState.showing) {
        replaceActionSheet(actionSheetRef, intermediarySheetRef)
      } else if (intermediaryState === IntermediaryState.hiding) {
        replaceActionSheet(intermediarySheetRef, actionSheetRef)
      }
    }
  }, [intermediaryState])

  const handleCloseInteractionSheet = () => {
    if (intermediaryState !== IntermediaryState.showing) {
      dispatch(resetInteraction())
    }
  }

  const handleCloseIntermediarySheet = () => {
    if (intermediaryState === IntermediaryState.hiding) {
      dispatch(setIntermediaryState(IntermediaryState.absent))
    } else {
      dispatch(resetInteraction())
    }
  }

  const renderBody = () => {
    switch (interactionType) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      case FlowType.CredentialShare:
        return isFullScreenInteraction ? (
          <CredentialShareFas />
        ) : (
          <CredentialShareBas />
        )
      case FlowType.CredentialOffer:
        return isFullScreenInteraction ? (
          <CredentialOfferFas />
        ) : (
          <CredentialOfferBas />
        )
      default:
        return null
    }
  }

  /**
   * NOTE: On iOS the @Loader doesn't show up while an @ActionSheet is active. This is due
   * to a RN limitation of showing 2 modals simultaneously. Fixed by nesting the @Loader
   * inside each @ActionSheet (only for iOS).
   */
  return (
    <>
      <ActionSheet
        {...ACTION_SHEET_PROPS}
        ref={actionSheetRef}
        onClose={handleCloseInteractionSheet}
        headerAlwaysVisible={true}
        containerStyle={
          isFullScreenInteraction ? styles.containerFAS : styles.containerBAS
        }
        CustomHeaderComponent={
          isFullScreenInteraction ? (
            <View />
          ) : (
            <IconWrapper>
              <View style={styles.basIcon}>
                <InteractionIcon />
              </View>
            </IconWrapper>
          )
        }
      >
        {Platform.OS === 'ios' && <Loader />}
        {renderBody()}
      </ActionSheet>
      {intermediaryState !== IntermediaryState.absent && (
        <ActionSheet
          {...ACTION_SHEET_PROPS}
          ref={intermediarySheetRef}
          onClose={handleCloseIntermediarySheet}
          containerStyle={styles.containerBAS}
          CustomHeaderComponent={<View />}
        >
          {Platform.OS === 'ios' && <Loader />}
          <IntermediaryActionSheet />
        </ActionSheet>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  containerFAS: {
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainBlack,
    justifyContent: 'space-between',
  },
  containerBAS: {
    padding: 5,
    backgroundColor: Colors.transparent,
  },
  basIcon: {
    position: 'absolute',
    top: 35,
    zIndex: 2,
  },
})

export default InteractionActionSheet
