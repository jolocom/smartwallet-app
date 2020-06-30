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
  getIsMultipleCredentials,
  getInteractionSummary,
} from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import { resetInteraction } from '~/modules/interaction/actions'
import MultipleCredentials from './MultipleCredentials'
import SingleCredential from './SingleCredential'
import Card from './Card'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const ActionSheetContainer: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null)

  const dispatch = useDispatch()
  const interactionSheet = useSelector(getInteractionSheet)
  const isMultipleCredentials = useSelector(getIsMultipleCredentials)
  const summary = useSelector(getInteractionSummary)

  useEffect(() => {
    if (interactionSheet) {
      actionSheetRef.current?.setModalVisible()
    } else {
      actionSheetRef.current?.setModalVisible(false)
    }
  }, [interactionSheet])

  const handleCloseSheet = () => dispatch(resetInteraction())

  // TODO: to add proper type annotation
  const renderCards = (handletoggleScroll: (value: boolean) => void) => {
    return summary.map((claim: any, idx: number) => (
      <Card key={claim.type + idx} onToggleScroll={handletoggleScroll} />
    ))
  }

  const renderBody = () => {
    switch (interactionSheet) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      default:
        return (
          <>
            <Paragraph>{interactionSheet}</Paragraph>
          </>
        )
    }
  }

  const renderInteraction = () => {
    if (isMultipleCredentials) {
      return (
        <MultipleCredentials
          ctaText="Receive"
          title="Name of Service"
          description="Choose one or more documents provided by this
          service and we will generate them for you"
        >
          {renderCards}
        </MultipleCredentials>
      )
    } else {
      return (
        <SingleCredential
          title="You recieved an ID Card"
          description="Good news, your request was successful and you have recieved the necessary document. Dont forget to save it!"
          ctaText="Receive"
        >
          {renderBody()}
        </SingleCredential>
      )
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
          isMultipleCredentials
            ? styles.containerMultiple
            : styles.containerSingle
        }
      >
        {renderInteraction()}
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
