import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'

import Paragraph from '~/components/Paragraph'
import {
  getInteractionSheet,
  getIsFullScreenInteraction,
} from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import { resetInteraction } from '~/modules/interaction/actions'
import CredentialShare from './CredentialShare'
import CredentialReceive from './CredentialReceive'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const ActionSheetContainer: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null)

  const dispatch = useDispatch()
  const interactionSheet = useSelector(getInteractionSheet)
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)

  useEffect(() => {
    if (interactionSheet) {
      actionSheetRef.current?.setModalVisible()
    } else {
      actionSheetRef.current?.setModalVisible(false)
    }
  }, [interactionSheet])

  const handleCloseSheet = () => dispatch(resetInteraction())

  const renderBody = () => {
    switch (interactionSheet) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      case FlowType.CredentialShare:
        return <CredentialShare />
      case FlowType.CredentialReceive:
        return <CredentialReceive />
      default:
        return <Paragraph>{interactionSheet}</Paragraph>
    }
  }

  return (
    <>
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        onClose={handleCloseSheet}
        footerHeight={0}
        //NOTE: removes shadow artifacts left from transparent view elevation
        elevation={0}
        //NOTE: removes the gesture header
        CustomHeaderComponent={<View />}
        containerStyle={
          isFullScreenInteraction
            ? styles.containerMultiple
            : styles.containerSingle
        }
      >
        {renderBody()}
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
    flex: 1,
    justifyContent: 'space-between',
    // TODO: height should fit the content
    height: SCREEN_HEIGHT / 2,
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
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

export default ActionSheetContainer
