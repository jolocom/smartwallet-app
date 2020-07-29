import React, { useEffect, useRef, RefObject } from 'react'
import { View, StyleSheet, Dimensions, Image } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { useSelector, useDispatch } from 'react-redux'
import {
  FlowType,
  InteractionSummary,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'

import Authentication from '~/screens/Modals/Interactions/Authentication'
import Authorization from '~/screens/Modals/Interactions/Authorization'

import {
  getInteractionType,
  getIsFullScreenInteraction,
  getIntermediaryState,
  getInteractionSummary,
} from '~/modules/interaction/selectors'

import { Colors } from '~/utils/colors'
import { resetInteraction } from '~/modules/interaction/actions'
import CredentialShare from '~/screens/Modals/Interactions/CredentialShare'
import CredentialReceive from '~/screens/Modals/Interactions/CredentialReceive'
import IntermediaryActionSheet from './IntermediaryActionSheet'
import { IntermediaryState } from '~/modules/interaction/types'
import { setIntermediaryState } from '~/modules/interaction/actions'
import { InitiatorPlaceholderIcon } from '~/assets/svg'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height
const ACTION_SHEET_PROPS = {
  closeOnTouchBackdrop: false,
  footerHeight: 0,
  closeOnPressBack: false,
  //NOTE: removes shadow artifacts left from transparent view elevation
  elevation: 0,
  //NOTE: removes the gesture header
  CustomHeaderComponent: <View />,
}

const BasWrapper: React.FC = ({ children }) => (
  <View style={styles.wrapper}>{children}</View>
)

const BasIconWrapper: React.FC = ({ children }) => (
  <View
    style={{
      width: '100%',
      marginTop: -70,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 20,
    }}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.white,
      }}
    >
      {children}
    </View>
  </View>
)

const InteractionActionSheet: React.FC = () => {
  const actionSheetRef = useRef<ActionSheet>(null)
  const intermediarySheetRef = useRef<ActionSheet>(null)

  const dispatch = useDispatch()
  const interactionType = useSelector(getInteractionType)
  const intermediaryState = useSelector(getIntermediaryState)
  const isFullScreenInteraction = useSelector(getIsFullScreenInteraction)
  const summary: InteractionSummary = useSelector(getInteractionSummary)
  console.log(summary)
  const initiatorLogo = summary.initiator?.publicProfile?.image
  // const initiatorLogo = 'https://banner2.cleanpng.com/20180604/pol/kisspng-react-javascript-angularjs-ionic-atom-5b154be6709500.6532453515281223424611.jpg'

  useEffect(() => {
    if (interactionType) {
      actionSheetRef.current?.setModalVisible()
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

  const handleCloseSheet = () => {
    if (intermediaryState === IntermediaryState.hiding) {
      dispatch(setIntermediaryState(IntermediaryState.absent))
    } else if (intermediaryState === IntermediaryState.absent) {
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
        {...ACTION_SHEET_PROPS}
        ref={actionSheetRef}
        onClose={handleCloseSheet}
        containerStyle={
          isFullScreenInteraction
            ? styles.containerMultiple
            : styles.containerSingle
        }
      >
        {isFullScreenInteraction ? (
          renderBody()
        ) : (
          <BasWrapper>
            <BasIconWrapper>
              {initiatorLogo ? (
                <Image source={{ uri: initiatorLogo }} />
              ) : (
                <InitiatorPlaceholderIcon />
              )}
            </BasIconWrapper>
            {renderBody()}
          </BasWrapper>
        )}
      </ActionSheet>
      {intermediaryState !== IntermediaryState.absent && (
        <ActionSheet
          {...ACTION_SHEET_PROPS}
          ref={intermediarySheetRef}
          onClose={handleCloseSheet}
          containerStyle={styles.containerSingle}
        >
          <BasWrapper>
            <IntermediaryActionSheet />
          </BasWrapper>
        </ActionSheet>
      )}
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
