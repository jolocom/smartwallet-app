import React, { useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { useSelector, useDispatch } from 'react-redux'

import Paragraph from '~/components/Paragraph'
import {
  getInteractionSheet,
  getInteractionId,
} from '~/modules/interactions/selectors'
import { Colors } from '~/utils/colors'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'
import { resetInteraction } from '~/modules/interactions/actions'

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

  const handleCloseSheet = () => dispatch(resetInteraction())

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
        containerStyle={styles.actionSheet}
      >
        <View style={styles.wrapper}>
          {(() => {
            switch (interactionSheet) {
              case FlowType.Authentication:
                return <Authentication />
              case FlowType.Authorization:
                return <Authorization />
              default:
                return (
                  <>
                    <Paragraph>{interactionSheet}</Paragraph>
                    <Paragraph>{interactionId}</Paragraph>
                  </>
                )
            }
          })()}
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
    backgroundColor: Colors.black,
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
})

export default ActionSheetContainer
