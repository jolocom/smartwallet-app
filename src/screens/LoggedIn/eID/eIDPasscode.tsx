import React, { useEffect, useMemo, useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Passcode from '~/components/Passcode'
import { ActivityIndicator, Alert, View } from 'react-native'
import { AA2Messages } from './types'
import { aa2EmitterTemp } from './events'
import { usePasscode } from '~/components/Passcode/context'
import { sleep } from '~/utils/generic'
import { StackActions } from '@react-navigation/routers'

const ALL_EID_PIN_ATTEMPTS = 3

enum PinVariant {
  PIN = 'PIN',
  CAN = 'CAN',
  PUK = 'PUK',
}

type EnterPinResponse = {
  msg: 'ENTER_PIN' | 'ENTER_CAN' | 'ENTER_PUK'
  error: string
  reader: {
    name: 'NFC'
    attached: boolean
    keypad: false
    card: {
      inoperative: boolean
      deactivated: boolean
      retryCounter: number
    }
  }
}

/**
 * TODO:
 * remove after testing
 */
const PIN_DATA_3 = {
  msg: 'ENTER_PIN',
  reader: {
    name: 'NFC',
    attached: true,
    keypad: false,
    card: {
      inoperative: false,
      deactivated: false,
      retryCounter: 3,
    },
  },
}
/**
 * TODO:
 * remove after testing
 */
const PIN_DATA_2 = {
  msg: 'ENTER_PIN',
  reader: {
    name: 'NFC',
    attached: true,
    keypad: false,
    card: {
      inoperative: false,
      deactivated: false,
      retryCounter: 2,
    },
  },
}

/**
 * TODO:
 * remove after testing
 */
const CAN_DATA = {
  msg: 'ENTER_CAN',
  reader: {
    name: 'NFC',
    attached: true,
    keypad: false,
    card: {
      inoperative: false,
      deactivated: false,
      retryCounter: 1,
    },
  },
}

/**
 * TODO:
 * remove after testing
 */
const PUK_DATA = {
  msg: 'ENTER_PUK',
  reader: {
    name: 'NFC',
    attached: true,
    keypad: false,
    card: {
      inoperative: false,
      deactivated: false,
      retryCounter: 0,
    },
  },
}

/**
 * TODO:
 * remove after testing
 */
const PUK_DATA_INOPERATIVE = {
  msg: 'ENTER_PUK',
  reader: {
    name: 'NFC',
    attached: true,
    keypad: false,
    card: {
      inoperative: true,
      deactivated: false,
      retryCounter: 0,
    },
  },
}

interface PasscodeErrorSetterProps {
  errorText: string | null
}
/**
 * NOTE:
 * this component can only be used inside Passcode context
 */
const PasscodeErrorSetter: React.FC<PasscodeErrorSetterProps> = ({
  errorText,
}) => {
  const { setPinError, setPinErrorText } = usePasscode()

  useEffect(() => {
    if (Boolean(errorText)) {
      setPinError(true)
      setPinErrorText(errorText)
    }
  }, [errorText])

  return null
}

/**
 * QUESTION:
 * How do we handle error in send cmds (results in error prop on ENTER_PIN msg)
 */
const eIDPasscode = ({ navigation }) => {
  const [pinVariant, setPinVariant] = useState(PinVariant.PIN)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [waitingForMsg, setWaitingForMsg] = useState(false)

  /**
   * handler for PUK
   */
  useEffect(() => {
    const updateToPuk = (data: EnterPinResponse) => {
      setWaitingForMsg(false)
      setPinVariant(PinVariant.PUK)
      if (data.reader.card.inoperative === true) {
        /**
         * TODO:
         * Show the eID card locked screen
         */
        Alert.alert('Locked', 'You card is locked', [
          {
            onPress: () => {
              navigation.dispatch(StackActions.popToTop())
              navigation.goBack(null)
            },
          },
        ])
      }
    }
    aa2EmitterTemp.on(AA2Messages.EnterPuk, updateToPuk)
    return () => {
      aa2EmitterTemp.off(AA2Messages.EnterPuk, updateToPuk)
    }
  }, [])

  /**
   * handler for CAN
   */
  useEffect(() => {
    const updateToCan = () => {
      setWaitingForMsg(false)
      setPinVariant(PinVariant.CAN)
    }
    aa2EmitterTemp.on(AA2Messages.EnterCan, updateToCan)
    return () => {
      aa2EmitterTemp.off(AA2Messages.EnterCan, updateToCan)
    }
  }, [])

  /**
   * handler for PIN
   */
  useEffect(() => {
    const updateToPin = (data: EnterPinResponse) => {
      console.log(data.msg, data.reader.card.retryCounter)

      setWaitingForMsg(false)

      setPinVariant(PinVariant.PIN)
      const errorText = `Wrong PIN, you used ${
        ALL_EID_PIN_ATTEMPTS - data.reader.card.retryCounter
      }/${ALL_EID_PIN_ATTEMPTS} attempts`
      if (data.reader.card.retryCounter !== ALL_EID_PIN_ATTEMPTS) {
        setErrorText(errorText)
      }
    }
    aa2EmitterTemp.on(AA2Messages.EnterPin, updateToPin)
    return () => {
      aa2EmitterTemp.off(AA2Messages.EnterPin, updateToPin)
    }
  }, [])

  const title = useMemo(() => {
    if (pinVariant === PinVariant.PIN) {
      return 'To allow data exchange enter you six digit eID PIN'
    } else if (pinVariant === PinVariant.CAN) {
      return 'For a third attempt, please first enter the six digit Card Access Number (CAN)'
    } else if (pinVariant === PinVariant.PUK) {
      return 'Last change, enter your PUK'
    } else {
      return ''
    }
  }, [pinVariant])

  const handleOnSubmit = async (passcode: string) => {
    setWaitingForMsg(true)
    setErrorText(null)

    await sleep(2000)
    if (pinVariant === PinVariant.PIN) {
      /**
       * TODO:
       * send SET_PIN with passcode
       */
      /**
       * TODO:
       * remove after aa2 implementation is ready
       */
      /**
       * test PIN
       */
      // aa2EmitterTemp.emit(AA2Messages.EnterPin, PIN_DATA_2)
      // aa2EmitterTemp.emit(AA2Messages.EnterCan, CAN_DATA)
      aa2EmitterTemp.emit(AA2Messages.EnterPuk, PUK_DATA)
    } else if (pinVariant === PinVariant.CAN) {
      /**
       * send SET_CAN with passcode
       */
      /**
       * TODO:
       * remove after aa2 implementation is ready
       */
      aa2EmitterTemp.emit(AA2Messages.EnterCan, CAN_DATA)
    } else if (pinVariant == PinVariant.PUK) {
      /**
       * send SET_PUK with passcode
       */
      /**
       * TODO:
       * remove after aa2 implementation is ready
       */
      // aa2EmitterTemp.emit(AA2Messages.EnterPin, PIN_DATA_3)
      aa2EmitterTemp.emit(AA2Messages.EnterPuk, PUK_DATA_INOPERATIVE)
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <Passcode onSubmit={handleOnSubmit} length={6}>
        <PasscodeErrorSetter errorText={errorText} />
        <Passcode.Container>
          <Passcode.Header title={title} errorTitle={title} />
          <Passcode.Input />
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <Passcode.Error />
          </View>
          {waitingForMsg && <ActivityIndicator />}
        </Passcode.Container>
        <Passcode.Container>
          <Passcode.Forgot />
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}

export default eIDPasscode
