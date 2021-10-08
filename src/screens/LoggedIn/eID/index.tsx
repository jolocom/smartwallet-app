import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { StackActions } from '@react-navigation/routers'
import NfcManager from 'react-native-nfc-manager'
import { aa2Module } from 'react-native-aa2-sdk'

import Btn, { BtnTypes } from '~/components/Btn'
import { useToasts } from '~/hooks/toasts'
import { Colors } from '~/utils/colors'
import { RouteProp, useRoute } from '@react-navigation/core'
import { AusweisProvider } from './context'
import { useAusweisContext } from './hooks'
import { MainStackParamList } from '../Main'
import { ScreenNames } from '~/types/screens'
import { AA2Messages, eIDScreens } from './types'
import { aa2EmitterTemp } from './events'
import {
  AusweisRequestReview,
  AusweisRequest,
  CompatibilityCheck,
  AusweisPasscode,
} from './components'

const eIDStack = createStackNavigator()

const useCheckNFC = () => {
  return async () => {
    const supported = await NfcManager.isSupported()
    console.log('supported', supported)

    if (supported) {
      await NfcManager.start()
    } else {
      throw new Error('NFC not supported')
    }
    const isEnabled = await NfcManager.isEnabled()
    console.log({ isEnabled })

    if (!isEnabled) {
      throw new Error('NFC is not enabled')
    }
  }
}

const InteractionSheet = ({ navigation }) => {
  const checkNFC = useCheckNFC()
  const { scheduleErrorWarning } = useToasts()

  const tcToken =
    'https://test.governikus-eid.de/Autent-DemoApplication/RequestServlet?provider=demo_epa_20&redirect=true'
  useEffect(() => {
    ;(async () => {
      try {
        const requestDetails = await aa2Module.processRequest(tcToken)
        /**
         * TODO:
         * 1. receive ACCESS_RIGHTS msg
         * 2. receive CERTIFICATE msg
         */
        console.log({ requestDetails })
      } catch (e) {
        console.log('Error processing request', e)
      }
    })()

    return () => {
      /**
       * TODO: disconnect SDK
       * TODO: cancel Auth
       * @ausweis
       */
    }
  }, [])

  const handleProceed = async () => {
    try {
      /**
       * TODO:
       * 1. check if NFC is supported and enabled: await checkNFC()
       */
      navigation.navigate(eIDScreens.ReadinessCheck)
    } catch (e) {
      console.log({ e })
      scheduleErrorWarning(e)
    }
  }

  return (
    <View>
      <Text style={styles.text}>1. Initialized the sdk</Text>
      <Text style={styles.text}>
        2. Send RUN_AUTH cmd and receive ACCESS_RIGHTS msg (contains request
        details)
      </Text>

      <Text style={styles.text}>
        3.Receive CERTIFICATE msg to have a link value of the service that sends
        the request
      </Text>
      <Text style={styles.text}>
        4. run NFC check before moving to the next screen
      </Text>

      <Btn onPress={handleProceed}>Check your readiness</Btn>
      <Btn type={BtnTypes.secondary} onPress={() => navigation.goBack()}>
        Close
      </Btn>
    </View>
  )
}

const RequestDetails = ({ navigation }) => {
  useEffect(() => {
    aa2EmitterTemp.on(AA2Messages.EnterPin, () => {
      navigation.navigate(eIDScreens.EnterPIN)
    })
  }, [])

  const handleAcceptRequest = () => {
    /**
     * TODO:
     * 1. send SET_ACCESS_RIGHTS cmd
     * 2. send ACCESS cmd
     */
    setTimeout(() => {
      aa2EmitterTemp.emit(AA2Messages.EnterPin)
    }, 2000)
  }

  const handleTerminateRequest = () => {
    /**
     * TODO: in case user decides to ignore the request
     * we need to cancel the workflow
     * { cmd: 'CANCEL'} @ausweis
     */
    navigation.dispatch(StackActions.popToTop())
    navigation.goBack(null)
  }
  return (
    <View>
      <Text style={styles.text}>
        1. Send SET_ACCESS_RIGHTS cmd to change optional fields {'\n'}
      </Text>

      <Text style={styles.text}>
        2. Send ACCEPT cmd to accept requested information (on proceed press, i
        assume) {'\n'}
        <Text style={styles.subtext}>
          "The workflow will be paused before we send this command". Does it
          mean that we won't be able to send GET_READER cmd to check eID
          functionality implementation
        </Text>
      </Text>

      <Text style={styles.text}>
        3. Wait for ENTER_PIN cmd {'\n'}
        <Text style={styles.subtext}>
          Show loader in the button, we cant't really move to pin flow
          beforehand
        </Text>
      </Text>

      <Btn onPress={handleAcceptRequest}>Proceed</Btn>
      <Btn type={BtnTypes.secondary} onPress={handleTerminateRequest}>
        Ignore
      </Btn>
    </View>
  )
}

const EnterPIN = ({ navigation }) => {
  const { scheduleInfo } = useToasts()
  useEffect(() => {
    aa2EmitterTemp.on(AA2Messages.EnterCan, () => {
      /**
       * show CAN variant
       */
    })
    aa2EmitterTemp.on(AA2Messages.EnterPuk, () => {
      /**
       * show PUK variant
       */
    })

    aa2EmitterTemp.on(AA2Messages.SetPin, (pin) => {
      scheduleInfo({
        title: 'The workflow has completed',
        message: `You successfully shared your data and provided correct pin ${pin}`,
      })
      navigation.dispatch(StackActions.popToTop())
      navigation.goBack(null)
    })
  }, [])
  const handlePinSubmit = () => {
    /**
     * TODO:
     * if no msg is being sent then the workflow succeeded
     */
    aa2EmitterTemp.emit(AA2Messages.SetPin, 111111)
  }

  const handleShowPUK = () => {
    aa2EmitterTemp.emit(AA2Messages.EnterPuk)
  }
  const handleShowCAN = () => {
    aa2EmitterTemp.emit(AA2Messages.EnterCan)
  }

  return (
    <View>
      <Text style={styles.text}>
        1. This screen should come up declaratively
      </Text>
      <Text style={styles.text}>
        2. Send SET_PIN cmd with user pin {'\n'}
        <Text style={styles.subtext}>
          - Native can also send invalid cmd, then error is attached to
          consequent ENTER_PIN msg with error the counter is not decreased{' '}
          {'\n'}- ENTER_PIN will attach reader prop, which contains information
          about the card
        </Text>
      </Text>
      <Text style={styles.text}>
        3. If another ENTER_PIN msg comes provided PIN was incorrect - decrease
        attempts left {'\n'}
        <Text style={styles.subtext}>
          If correct PIN was provided - attempts left should be reset to 3
        </Text>
      </Text>
      <Text style={styles.text}>
        4. If ENTER_CAN msg is send, show CAN screen variant (CAN has unlimited
        attempts) {'\n'}
        <Text style={styles.subtext}>
          Once your application provides a correct CAN the AusweisApp2 will send
          an ENTER_PIN again with a retryCounter of 1.
        </Text>
      </Text>
      <Text style={styles.text}>
        5. If ENTER_PUK msg is send, show PUK screen variant (10 times) {'\n'}
        <Text style={styles.subtext}>
          Once your application provides a correct PUK the AusweisApp2 will send
          an ENTER_PIN again with a retryCounter of 3.
        </Text>
      </Text>
      <Btn type={BtnTypes.tertiary} onPress={handleShowCAN}>
        Show CAN variant
      </Btn>
      <Btn type={BtnTypes.tertiary} onPress={handleShowPUK}>
        Show PUK variant
      </Btn>

      <Btn onPress={handlePinSubmit}>Submit pin</Btn>
    </View>
  )
}

const AusweisInteraction = () => {
  const request =
    useRoute<RouteProp<MainStackParamList, ScreenNames.eId>>().params
  const { setRequest } = useAusweisContext()

  useEffect(() => {
    setRequest(request)
  }, [])

  return (
    <eIDStack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName={eIDScreens.InteractionSheet}
    >
      <eIDStack.Screen
        name={eIDScreens.InteractionSheet}
        component={AusweisRequest}
      />
      <eIDStack.Screen
        name={eIDScreens.ReadinessCheck}
        component={CompatibilityCheck}
      />
      <eIDStack.Screen
        name={eIDScreens.RequestDetails}
        component={AusweisRequestReview}
      />
      <eIDStack.Screen name={eIDScreens.EnterPIN} component={AusweisPasscode} />
    </eIDStack.Navigator>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subtext: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.activity,
    marginBottom: 20,
  },
})

export default () => (
  <AusweisProvider>
    <AusweisInteraction />
  </AusweisProvider>
)
