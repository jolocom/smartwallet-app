import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'

import { eIDScreens } from '../types'
import { usePop, useRedirect } from '~/hooks/navigation'
import { useFailed, useSuccess } from '~/hooks/loader'
import { aa2Module } from 'react-native-aa2-sdk'

type ReaderMsg = {
  msg: 'READER'
  name: 'NFC'
  attached: boolean // Indicates whether a card reader is connected or disconnected.
  keypad: false
  card: {
    inoperative: boolean
    deactivated: boolean
    retryCounter: number
  }
}

enum CardStatus {
  inoperative = 'inoperative',
  deactivated = 'deactivated',
  ready = 'ready',
}

export const CompatibilityCheck = () => {
  const [cardStatus, setCardStatus] = useState<CardStatus | null>(null)
  const redirect = useRedirect()
  const pop = usePop()
  const showSuccess = useSuccess()
  const showFailed = useFailed()

  /**
   * handler for READER msg
   */
  useEffect(() => {
    aa2Module.setHandlers({
      handleCardRequest: () => {
        /**
         * NOTE:
         * we are not passing onDismiss as a param,
         * as there are no additional logic we want to run
         * when the scanner closes;
         * or if we decide to abort the workflow from within
         * the run_auth wf we shall pass to compatibility check
         * a param (a suggestion)
         */
        // @ts-ignore
        redirect(eIDScreens.AusweisScanner)
      },
      handleCardInfo: (info) => {
        if (info && !cardStatus) {
          const { inoperative, deactivated } = info
          const resultStatus = deactivated || !inoperative
          if (deactivated) {
            setCardStatus(CardStatus.deactivated)
          } else if (inoperative) {
            setCardStatus(CardStatus.inoperative)
          } else if (resultStatus) {
            setCardStatus(CardStatus.ready)
          }
        }
      },
    })
  }, [])

  /**
   * show loader when card status is known
   */
  useEffect(() => {
    if (cardStatus !== null) {
      Platform.OS === 'android' && pop(1)
      if (cardStatus === CardStatus.ready) {
        showSuccess()
      } else {
        showFailed()
      }
    }
  }, [cardStatus])

  const handleCheckCompatibility = async () => {
    /**
     * NOTE:
     * we are not passing onDismiss as a param,
     * as there are no additional logic we want to run
     * when the scanner closes; it is not
     * in any currently running workflows
     */
    // @ts-expect-error
    redirect(eIDScreens.AusweisScanner)
  }
  const handleShowPinInstructions = () => {
    // @ts-expect-error
    redirect(eIDScreens.PasscodeDetails)
  }

  const handleSubmit = () => {
    // @ts-expect-error
    redirect(eIDScreens.RequestDetails)
  }

  return (
    <ScreenContainer>
      <JoloText kind={JoloTextKind.title}>
        Before you proceed with digital interaction your device must meet
        certain technical requirements
      </JoloText>
      <View style={styles.optionContainer}>
        <JoloText color={Colors.success}>1</JoloText>
        <JoloText kind={JoloTextKind.title}>
          Check if your ID card is ready to be used
        </JoloText>

        {cardStatus ? (
          <JoloText>{cardStatus}</JoloText>
        ) : (
          <Btn type={BtnTypes.quinary} onPress={handleCheckCompatibility}>
            Check compatibility
          </Btn>
        )}
      </View>

      <View style={styles.optionContainer}>
        <JoloText color={Colors.success}>2</JoloText>
        <JoloText kind={JoloTextKind.title}>
          Make sure that your 6-digit PIN was activated
        </JoloText>

        <Btn type={BtnTypes.quinary} onPress={handleShowPinInstructions}>
          More info
        </Btn>
      </View>

      <Btn type={BtnTypes.tertiary} onPress={handleSubmit}>
        All done
      </Btn>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
})
