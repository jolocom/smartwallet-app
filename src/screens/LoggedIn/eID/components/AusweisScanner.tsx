import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { useDispatch } from 'react-redux'

import { setAusweisScannerKey } from '~/modules/ausweis/actions'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Ripple from '~/components/Ripple'

import { useGoBack } from '~/hooks/navigation'
import { ErrorIcon, NfcScannerAndroid, SuccessTick } from '~/assets/svg'
import { Colors } from '~/utils/colors'

import { AusweisStackParamList } from '..'
import { AusweisBottomSheet } from '../styled'
import { eIDScreens, AusweisScannerState } from '../types'
import useTranslation from '~/hooks/useTranslation'
import eIDHooks from '../hooks'
import BP from '~/utils/breakpoints'

const AnimatedStatus: React.FC<{
  isVisible: boolean
  onAnimationDone?: () => void
}> = ({ isVisible, children, onAnimationDone = () => {} }) => {
  const opacityValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacityValue, {
      duration: 100,
      useNativeDriver: true,
      toValue: isVisible ? 1 : 0,
    }).start(() => {
      isVisible && onAnimationDone()
    })
  }, [isVisible])

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { alignItems: 'center', justifyContent: 'center' },
        { opacity: opacityValue },
      ]}
    >
      {children}
    </Animated.View>
  )
}

export const AusweisScanner = () => {
  const { t } = useTranslation()
  const route =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.AusweisScanner>>()
  const {
    onDone = () => {},
    state: scannerState = AusweisScannerState.idle,
    onDismiss,
  } = route.params
  const goBack = useGoBack()
  const dispatch = useDispatch()
  const checkNfcSupport = eIDHooks.useCheckNFC()

  const isScreenFocused = useIsFocused()

  useBackHandler(() => {
    handleDismiss()
    return true
  })

  useEffect(() => {
    dispatch(setAusweisScannerKey(isScreenFocused ? route.key : null))
  }, [isScreenFocused])

  /**
   * Note:
   * In case user has disabled NFC when the scanner is on;
   * we don't have a listener for the NFC enabled, therefore,
   * running it with interval
   */
  useEffect(() => {
    const id = setInterval(() => {
      checkNfcSupport(() => {})
    }, 10000)

    return () => {
      dispatch(setAusweisScannerKey(null))
      clearInterval(id)
    }
  }, [])

  const handleSuccess = () => {
    setTimeout(() => {
      goBack()
      onDone()
    }, 500)
  }

  const handleDone = () => {
    setTimeout(() => {
      onDone()
    }, 200)
  }

  const handleDismiss = () => {
    /**
     * NOTE:
     * delegating removing scanner from the
     * navigation stack to the scanner;
     * onDismiss should contain logic without closing
     * the AusweisScanner screen
     */
    goBack()
    onDismiss && onDismiss()
  }

  const renderScannerStatus = () => {
    return (
      <View
        style={{
          ...styles.iconContainer,
          ...(scannerState !== AusweisScannerState.idle && styles.statusBorder),
        }}
      >
        <AnimatedStatus isVisible={scannerState === AusweisScannerState.idle}>
          <NfcScannerAndroid />
        </AnimatedStatus>
        <AnimatedStatus
          isVisible={scannerState === AusweisScannerState.loading}
        >
          <View style={styles.failedContainer}>
            <Ripple
              color={Colors.white}
              initialValue1={1}
              maxValue1={5}
              maxValue2={5}
              thickness={1}
            />
          </View>
        </AnimatedStatus>
        <AnimatedStatus
          isVisible={scannerState === AusweisScannerState.success}
          onAnimationDone={handleSuccess}
        >
          <View style={styles.failedContainer}>
            <SuccessTick color={Colors.white} />
          </View>
        </AnimatedStatus>
        <AnimatedStatus
          isVisible={scannerState === AusweisScannerState.failure}
          onAnimationDone={handleDone}
        >
          <View style={styles.failedContainer}>
            <ErrorIcon color={Colors.white} />
          </View>
        </AnimatedStatus>
      </View>
    )
  }

  return (
    <AusweisBottomSheet
      backgroundColor={Colors.badGrey}
      customContainerStyles={styles.sheetContainer}
    >
      <View style={styles.container}>
        <JoloText kind={JoloTextKind.title} customStyles={styles.header}>
          {t('AusweisScanner.header')}
        </JoloText>
        {renderScannerStatus()}
        <JoloText color={Colors.white} customStyles={styles.footer}>
          {t('AusweisScanner.startSubheader')}
        </JoloText>
      </View>
      <Btn
        disabled={
          scannerState === AusweisScannerState.success ||
          scannerState === AusweisScannerState.failure
        }
        type={BtnTypes.senary}
        onPress={handleDismiss}
      >
        {t('AusweisScanner.cancelBtn')}
      </Btn>
    </AusweisBottomSheet>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    paddingTop: BP({ large: 32, medium: 28, default: 24 }),
    paddingBottom: BP({ default: 22, small: 18, xsmall: 18 }),
  },
  header: {
    marginBottom: BP({ large: 32, medium: 28, default: 24 }),
  },
  statusBorder: {
    borderWidth: 2,
    borderColor: Colors.white90,
    borderRadius: 156 / 2,
  },
  successContainer: {
    width: 56,
    height: 56,
  },
  failedContainer: {
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: BP({ default: 22, small: 20, xsmall: 18 }),
  },
  iconContainer: {
    width: 156,
    height: 156,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 10,
    marginTop: BP({ large: 36, medium: 24, default: 16 }),
  },
})
