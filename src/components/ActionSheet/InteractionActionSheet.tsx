import React, { RefObject, useEffect, useRef } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import ActionSheet, { ActionSheetProps } from 'react-native-actions-sheet'
import { useDispatch, useSelector } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'
import {
  CredentialShareBas,
  CredentialShareFas,
} from '~/screens/Modals/Interactions/CredentialShare'
import {
  CredentialOfferBas,
  CredentialOfferFas,
} from '~/screens/Modals/Interactions/CredentialOffer'

import {
  getInteractionType,
  getIntermediaryState,
  getIsFullScreenInteraction,
} from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import {
  resetInteraction,
  setIntermediaryState,
} from '~/modules/interaction/actions'
import IntermediarySheetBody from './IntermediarySheetBody'
import { IntermediaryState } from '~/modules/interaction/types'
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

/**
 * Manages @ActionSheets: @InteractionSheet (default) and @IntermediarySheet (inputs). Only one
 * @ActionSheet should be active at a time.
 *
 * TODO: have some better way to manage @ActionSheets. Some sort of ActionSheetManager abstraction, that would
 * allow for easier addition or configuration of @ActionSheets. It could manage the @refs and the state of the sheets.
 */
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
      } else if (intermediaryState === IntermediaryState.switching) {
        replaceActionSheet(intermediarySheetRef, actionSheetRef)
        dispatch(setIntermediaryState(IntermediaryState.hiding))
      }
    }
  }, [intermediaryState])

  /**
   * Handles the dismissal of the @InteractionSheet when the @ActionSheet closes. The @InteractionSheet
   * can be dismissed by canceling the interaction (DENY button), or by tapping outside the @ActionSheet
   * (only relevant to @BAS). Hence, @handleCloseInteractionSheet will be called when there is a tap outside
   * the @ActionSheet, when the @InteractionSheet is @showing and when the interaction is canceled (by tapping
   * the DENY button). Furthermore, the interaction should be reset only when the user taps outside the @ActionSheet.
   */
  const handleCloseInteractionSheet = () => {
    if (intermediaryState !== IntermediaryState.showing && interactionType) {
      dispatch(resetInteraction())
    }
  }

  /**
   * Handles the dismissal of the @IntermediarySheet when called by the @onClose prop (@ActionSheet).
   * Similarly to @handleCloseInteractionSheet, the @IntermediarySheet can be closed by @switching with
   * the @InteractionSheet, as well as when there is a tap outside the @ActionSheet. On tap, the @IntermediarySheet
   * should be replaced with the @InteractionSheet
   */
  const handleCloseIntermediarySheet = () => {
    if (intermediaryState !== IntermediaryState.switching) {
        dispatch(setIntermediaryState(IntermediaryState.switching))
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
        headerAlwaysVisible={true}
        onClose={handleCloseInteractionSheet}
        containerStyle={
          isFullScreenInteraction ? styles.containerFAS : styles.containerBAS
        }
        CustomHeaderComponent={
          isFullScreenInteraction ? (
            <View />
          ) : (
            <IconWrapper customStyle={{height: 0}}>
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
      {intermediaryState !== IntermediaryState.hiding && (
        <ActionSheet
          {...ACTION_SHEET_PROPS}
          ref={intermediarySheetRef}
          onClose={handleCloseIntermediarySheet}
          containerStyle={styles.containerBAS}
          CustomHeaderComponent={<View />}
        >
          {Platform.OS === 'ios' && <Loader />}
          <IntermediarySheetBody />
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
    top: -35,
    zIndex: 2,
  },
})

export default InteractionActionSheet
