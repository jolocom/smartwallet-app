import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useSafeArea } from 'react-native-safe-area-context'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'
import CredentialShare from '~/screens/Modals/Interactions/CredentialShare'
import CredentialOffer from '~/screens/Modals/Interactions/CredentialOffer'

import {
  getInteractionType,
  getIntermediaryState,
} from '~/modules/interaction/selectors'
import {
  resetInteraction,
  setIntermediaryState,
} from '~/modules/interaction/actions'
import IntermediarySheetBody from './IntermediarySheetBody'
import { IntermediarySheetState } from '~/modules/interaction/types'
import Loader from '~/modals/Loader'
import CustomActionSheet from './CustomActionSheet'

/**
 * Manages @ActionSheets: @InteractionSheet (default) and @IntermediarySheet (inputs). Only one
 * @ActionSheet should be active at a time.
 *
 * TODO: have some better way to manage @ActionSheets. Some sort of ActionSheetManager abstraction, that would
 * allow for easier addition or configuration of @ActionSheets. It could manage the @refs and the state of the sheets.
 */

enum ActionSheetTypes {
  InteractionSheet,
  IntermediateSheet,
  None,
}

// TODO: update inline docs
const InteractionActionSheet: React.FC = () => {
  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)
  const { sheetState } = useSelector(getIntermediaryState)

  const [activeSheet, setActiveSheet] = useState(ActionSheetTypes.None)

  useEffect(() => {
    if (interactionType) {
      // NOTE: RN doesn't support showing 2 modals at the same time, so we need a timeout
      // to assure the loader is hidden before starting to animate the ActionSheet.
      setActiveSheet(ActionSheetTypes.InteractionSheet)
    } else {
      setActiveSheet(ActionSheetTypes.None)
    }
  }, [interactionType])

  const replaceActionSheet = (
    initial: ActionSheetTypes,
    next: ActionSheetTypes,
  ) => {
    setActiveSheet(initial)
    setTimeout(() => {
      setActiveSheet(next)
    }, 300)
  }

  useEffect(() => {
    if (interactionType) {
      if (sheetState === IntermediarySheetState.showing) {
        replaceActionSheet(
          ActionSheetTypes.InteractionSheet,
          ActionSheetTypes.IntermediateSheet,
        )
      } else if (sheetState === IntermediarySheetState.switching) {
        replaceActionSheet(
          ActionSheetTypes.IntermediateSheet,
          ActionSheetTypes.InteractionSheet,
        )
        dispatch(setIntermediaryState(IntermediarySheetState.hiding))
      }
    }
  }, [sheetState])

  /**
   * Handles the dismissal of the @InteractionSheet when the @ActionSheet closes. The @InteractionSheet
   * can be dismissed by canceling the interaction (DENY button), or by tapping outside the @ActionSheet
   * (only relevant to @BAS). Hence, @handleCloseInteractionSheet will be called when there is a tap outside
   * the @ActionSheet, when the @InteractionSheet is @showing and when the interaction is canceled (by tapping
   * the DENY button). Furthermore, the interaction should be reset only when the user taps outside the @ActionSheet.
   */
  const handleCloseInteractionSheet = () => {
    if (sheetState !== IntermediarySheetState.showing && interactionType) {
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
    if (sheetState !== IntermediarySheetState.switching) {
      dispatch(setIntermediaryState(IntermediarySheetState.switching))
    }
  }

  const renderBody = () => {
    switch (interactionType) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      case FlowType.CredentialShare:
        return <CredentialShare />
      case FlowType.CredentialOffer:
        return <CredentialOffer />
      default:
        return null
    }
  }

  // const insets = useSafeArea()
  // const basContainerStyles = {
  //   ...styles.containerBAS,
  //   ...(insets.bottom && { paddingBottom: insets.bottom }),
  // }
  // const fasContainerStyles = {
  //   ...styles.containerFAS,
  //   marginTop: -insets.top,
  // }

  /**
   * NOTE: On iOS the @Loader doesn't show up while an @ActionSheet is active. This is due
   * to a RN limitation of showing 2 modals simultaneously. Fixed by nesting the @Loader
   * inside each @ActionSheet (only for iOS).
   */
  return (
    <>
      <CustomActionSheet
        onClose={handleCloseInteractionSheet}
        show={activeSheet === ActionSheetTypes.InteractionSheet}
      >
        {Platform.OS === 'ios' && <Loader />}
        {renderBody()}
      </CustomActionSheet>

      {sheetState === IntermediarySheetState.showing && (
        <CustomActionSheet
          onClose={handleCloseIntermediarySheet}
          show={activeSheet === ActionSheetTypes.IntermediateSheet}
        >
          {Platform.OS === 'ios' && <Loader />}
          <IntermediarySheetBody />
        </CustomActionSheet>
      )}
    </>
  )
}

export default InteractionActionSheet
