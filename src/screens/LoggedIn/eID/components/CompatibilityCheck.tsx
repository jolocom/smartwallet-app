import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { StackActions } from '@react-navigation/routers'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Btn, { BtnTypes } from '~/components/Btn'
import { Colors } from '~/utils/colors'

import { useDispatch, useSelector } from 'react-redux'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { getLoaderState } from '~/modules/loader/selectors'
import { AA2Messages, eIDScreens } from '../types'
import { aa2EmitterTemp } from '../events'
import { useRedirect } from '~/hooks/navigation'

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
  const [readinessStatus, setReadinessStatus] = useState<boolean | null>(null)
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false)
  const [cardStatus, setCardStatus] = useState<CardStatus | null>(null)
  const redirect = useRedirect()

  const dispatch = useDispatch()
  const loaderState = useSelector(getLoaderState)

  /**
   * handler for READER msg
   */
  useEffect(() => {
    aa2EmitterTemp.on(AA2Messages.Reader, async (data: ReaderMsg) => {
      const { deactivated, inoperative } = data.card
      const resultStatus = deactivated || !inoperative
      if (deactivated) {
        setCardStatus(CardStatus.deactivated)
      } else if (inoperative) {
        setCardStatus(CardStatus.inoperative)
      } else if (resultStatus) {
        setCardStatus(CardStatus.ready)
      }
      setReadinessStatus(resultStatus)
    })
  }, [])

  /**
   * show loader when card status is known
   */
  useEffect(() => {
    if (readinessStatus !== null) {
      if (readinessStatus) {
        dispatch(
          setLoader({
            type: LoaderTypes.success,
            msg: 'The card is fully ready to be used',
          }),
        )
      } else {
        dispatch(
          setLoader({
            type: LoaderTypes.error,
            msg: 'Your card is not ready to be used',
          }),
        )
      }
    }
  }, [readinessStatus])

  /**
   * dismissing loader
   */
  useEffect(() => {
    let id: undefined | number
    if (loaderState.type !== LoaderTypes.default) {
      setTimeout(() => {
        dispatch(dismissLoader())
      }, 2000)
    }
    return () => {
      id && clearTimeout(id)
    }
  }, [JSON.stringify(loaderState)])

  const handleCheckCompatibility = async () => {
    setIsCheckingCompatibility(true)
  }
  const handleShowPinInstructions = () => {
    // navigation.navigate(eIDScreens.PINInstructions)
  }

  const handleSubmit = () => {
    // @ts-expect-error
    redirect(eIDScreens.RequestDetails)
  }

  useEffect(() => {
    let id: undefined | number
    if (isCheckingCompatibility) {
      id = setTimeout(() => {
        /**
         * NOTE:
         * uncomment below to check different card variant
         */
        // aa2EmitterTemp.emit(AA2Messages.Reader, LOCKED_CARD)
        // aa2EmitterTemp.emit(AA2Messages.Reader, DEACTIVATED_CARD)
        aa2EmitterTemp.emit(AA2Messages.Reader, ACTIVE_CARD)
      }, 2000)
    }
    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [isCheckingCompatibility])

  useEffect(() => {
    if (isCheckingCompatibility) {
      dispatch(
        setLoader({
          type: LoaderTypes.default,
          msg: 'Checking your card compatibility',
        }),
      )
    }
  }, [isCheckingCompatibility])

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
