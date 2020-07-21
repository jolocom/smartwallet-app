import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'

import {
  getInteractionType,
  getIsFullScreenInteraction,
  getIntermediaryState,
} from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import { resetInteraction } from '~/modules/interaction/actions'
import CredentialShare from './CredentialShare'
import CredentialReceive from './CredentialReceive'
import IntermediaryActionSheet from './IntermediaryActionSheet'
import useDelay from '~/hooks/useDelay'
import { IntermediaryState } from '~/modules/interaction/types'
import { setIntermediaryState } from '~/modules/interaction/actions'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const InteractionActionSheet: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null)

  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)
  const intermediaryState = useSelector(getIntermediaryState)
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)
  const isFullScreen =
    intermediaryState !== IntermediaryState.absent
      ? false
      : isFullScreenInteraction

  useEffect(() => {
    if (interactionType) {
      actionSheetRef.current?.setModalVisible()
    } else {
      actionSheetRef.current?.setModalVisible(false)
    }
  }, [interactionType])

  useEffect(() => {
    if (interactionType) {
      const hideAndShow = async () => {
        actionSheetRef.current?.setModalVisible(false)
        //NOTE: without delay it doesn't show it :(
        await useDelay(() => {
          actionSheetRef.current?.setModalVisible(true)
        }, 300)
      }
      hideAndShow()
    }
  }, [intermediaryState])

  const handleCloseSheet = () => {
    if (intermediaryState === IntermediaryState.hiding) {
      dispatch(setIntermediaryState(IntermediaryState.absent))
    } else if (intermediaryState === IntermediaryState.absent) {
      dispatch(resetInteraction())
    }
  }

  const renderBody = () => {
    if (intermediaryState === IntermediaryState.showing)
      return <IntermediaryActionSheet />

    switch (interactionType) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      case FlowType.CredentialShare:
        return <CredentialShare />
      case FlowType.CredentialReceive:
        return <CredentialReceive />
      default:
        return null
    }
  }

  return (
    <>
      <ActionSheet
        ref={actionSheetRef}
        closeOnTouchBackdrop={false}
        //gestureEnabled={!isFullScreen}
        onClose={handleCloseSheet}
        footerHeight={0}
        closeOnPressBack={false}
        //NOTE: removes shadow artifacts left from transparent view elevation
        elevation={0}
        //NOTE: removes the gesture header
        CustomHeaderComponent={<View />}
        containerStyle={
          isFullScreen ? styles.containerMultiple : styles.containerSingle
        }
      >
        {isFullScreen ? (
          renderBody()
        ) : (
          <View style={styles.wrapper}>{renderBody()}</View>
        )}
      </ActionSheet>
    </>
  )
}

const styles = StyleSheet.create({
  containerMultiple: {
    flex: 1,
    height: SCREEN_HEIGHT,
    paddingTop: 32,
    paddingBottom: 0,
    backgroundColor: Colors.mainBlack,
  },
  containerSingle: {
    padding: 5,
    backgroundColor: Colors.transparent,
  },
  wrapper: {
    width: '100%',
    backgroundColor: Colors.black,
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
})

export default InteractionActionSheet
