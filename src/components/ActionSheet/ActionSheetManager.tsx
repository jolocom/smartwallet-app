import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { FlowType } from 'react-native-jolocom'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'
import CredentialShare from '~/screens/Modals/Interactions/CredentialShare'
import CredentialOffer from '~/screens/Modals/Interactions/CredentialOffer'

import {
  getInteractionType,
  getIntermediaryState,
} from '~/modules/interaction/selectors'
import {
  setIntermediaryState,
} from '~/modules/interaction/actions'
import IntermediarySheetBody from './IntermediarySheetBody'
import { IntermediarySheetState } from '~/modules/interaction/types'
import Resolution from '~/screens/Modals/Interactions/Resolution'
import { useFinishInteraction } from '~/hooks/interactions'
import Fallin from '../animation/Fallin'

enum ActionSheetTypes {
  InteractionSheet,
  IntermediateSheet,
  None,
}

/**
 * Manages @ActionSheets: @InteractionSheet (default) and @IntermediarySheet (inputs). Only one
 * @ActionSheet should be active at a time.
 */

const ActionSheetManager: React.FC = () => {
  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)
  const { sheetState } = useSelector(getIntermediaryState)

  const finishInteraction = useFinishInteraction();

  const [activeSheet, setActiveSheet] = useState(ActionSheetTypes.None)

  useEffect(() => {
    if (interactionType) {
      // NOTE: RN doesn't support showing 2 modals at the same time, so we need a timeout
      // to assure the loader is hidden before starting to animate the ActionSheet.
      setTimeout(() => {
        setActiveSheet(ActionSheetTypes.InteractionSheet)
      }, 200)
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

  const renderInteractionBody = () => {
    switch (interactionType) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      case FlowType.CredentialShare:
        return <CredentialShare />
      case FlowType.CredentialOffer:
        return <CredentialOffer />
      case FlowType.Resolution:
        return <Resolution />
      default:
        return null
    }
  }

  const handleDismissInteraction = () => {
    /**
     * Handles the dismissal of the @InteractionSheet when the @ActionSheet closes. The @InteractionSheet
     * can be dismissed by canceling the interaction (DENY button), or by tapping outside the @ActionSheet
     * (only relevant to @BAS). Hence, @handleCloseInteractionSheet will be called when there is a tap outside
     * the @ActionSheet, when the @InteractionSheet is @showing and when the interaction is canceled (by tapping
     * the DENY button). Furthermore, the interaction should be reset only when the user taps outside the @ActionSheet.
     */
    if (sheetState !== IntermediarySheetState.showing && interactionType) {
      finishInteraction()
    /**
     * Handles the dismissal of the @IntermediarySheet when called by the @onClose prop (@ActionSheet).
     * Similarly to @handleCloseInteractionSheet, the @IntermediarySheet can be closed by @switching with
     * the @InteractionSheet, as well as when there is a tap outside the @ActionSheet. On tap, the @IntermediarySheet
     * should be replaced with the @InteractionSheet
     */
    } else if (sheetState !== IntermediarySheetState.switching) {
      dispatch(setIntermediaryState(IntermediarySheetState.switching))
    }

  }

  return (
    <View style={styles.fullScreen}>
      <TouchableWithoutFeedback onPress={handleDismissInteraction}>
        <View style={styles.tapArea} />
      </TouchableWithoutFeedback>
      <View style={styles.interactionBody}>
        <Fallin isFallingIn={activeSheet === ActionSheetTypes.InteractionSheet} from='bottom'>
          {renderInteractionBody()}
        </Fallin>
        <Fallin isFallingIn={sheetState === IntermediarySheetState.showing} from='bottom'>
          <IntermediarySheetBody /> 
        </Fallin>
      </View>
    </View>      
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  tapArea: {
    flex: 1,  
  },
  interactionBody: {
    flex: 0,
  }
})

export default ActionSheetManager
