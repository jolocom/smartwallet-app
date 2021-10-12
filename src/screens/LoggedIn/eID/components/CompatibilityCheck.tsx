import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { StackActions } from '@react-navigation/routers'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'

import { useDispatch, useSelector } from 'react-redux'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { getLoaderState } from '~/modules/loader/selectors'
import { AA2Messages, AusweisPasscodeMode, eIDScreens } from '../types'
import { aa2EmitterTemp } from '../events'
import { usePop, useRedirect } from '~/hooks/navigation'
import { useFailed, useSuccess } from '~/hooks/loader'
import { useAusweisInteraction } from '../hooks'
import { aa2Module } from 'react-native-aa2-sdk'
import { useFocusEffect } from '@react-navigation/core'

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

/**
 * TODO:
 * - check "attached" prop permutations
 */
const READER_BASE = {
  msg: 'READER',
  name: 'NFC',
  attached: true,
  keypad: false,
}

const LOCKED_CARD = {
  ...READER_BASE,
  card: {
    inoperative: true,
    deactivated: false,
    retryCounter: 0,
  },
}

const DEACTIVATED_CARD = {
  ...READER_BASE,
  card: {
    inoperative: false,
    deactivated: true, // True if eID functionality is deactivated, otherwise false
    retryCounter: 3,
  },
}

const ACTIVE_CARD = {
  ...READER_BASE,
  card: {
    inoperative: false,
    deactivated: false,
    retryCounter: 3,
  },
}

enum CardStatus {
  inoperative = 'inoperative',
  deactivated = 'deactivated',
  ready = 'ready',
}

/**
 * 1. Send GET_READER cmd to receive READER msg to check for "deactivated"
 * field that checks if eID functionality was implemented {'\n'}
 * handleCheckCompatibility:
 * 1. ios/android show popup to insert a card
 * once the card is inserted
 * 2. Wait for READER msg to get info about "deactivated"/"inoperative" states
 */
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
