import React, { useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { useSelector, useDispatch } from 'react-redux'

import Paragraph from '~/components/Paragraph'
import {
  getInteractionSheet,
  getInteractionId,
} from '~/modules/account/selectors'
import { Colors } from '~/utils/colors'
import { resetInteractionSheet } from '~/modules/account/actions'

const ActionSheetContainer: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null)

  const dispatch = useDispatch()
  const interactionSheet = useSelector(getInteractionSheet)
  const interactionId = useSelector(getInteractionId)

  useEffect(() => {
    if (interactionSheet) {
      actionSheetRef.current?.setModalVisible()
    } else {
      actionSheetRef.current?.setModalVisible(false)
    }
  }, [interactionSheet])

  const handleCloseSheet = () => dispatch(resetInteractionSheet())

  return (
    <>
      <ActionSheet
        ref={actionSheetRef}
        onClose={handleCloseSheet}
        //NOTE: removes shadow artifacts left from transparent view elevation
        elevation={0}
        gestureEnabled
        //NOTE: removes the gesture header
        CustomHeaderComponent={<View />}
        containerStyle={styles.actionSheet}
      >
        <View style={styles.wrapper}>
          <Paragraph>{interactionSheet}</Paragraph>
          <Paragraph>{interactionId}</Paragraph>
        </View>
      </ActionSheet>
    </>
  )
}

const styles = StyleSheet.create({
  actionSheet: {
    padding: 5,
    backgroundColor: Colors.transparent,
  },
  wrapper: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.black,
    borderRadius: 20,
    justifyContent: 'center',
  },
})

export default ActionSheetContainer
