import { RouteProp, useIsFocused, useRoute } from '@react-navigation/core'
import React, { useEffect, useRef, useState } from 'react'
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
import { useCheckNFC } from '../hooks'
import BP from '~/utils/breakpoints'

/**
 * TODO:
 * Scanner on Android needs a message with a big letters
 * saying "dont remove the card until the scanner popup is gone"
 */
export const AusweisScanner = () => {
  const { t } = useTranslation()
  const route =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.AusweisScanner>>()
  const {
    onDone = () => {},
    state = AusweisScannerState.idle,
    onDismiss,
  } = route.params
  const goBack = useGoBack()
  const iconOpacityValue = useRef(new Animated.Value(0)).current
  const loadingOpacityValue = useRef(new Animated.Value(0)).current
  const [animationState, setAnimationState] = useState(state)
  const dispatch = useDispatch()
  const { checkNfcSupport } = useCheckNFC()

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

  const showAnimation = (value: Animated.Value) =>
    Animated.timing(value, {
      duration: 500,
      useNativeDriver: true,
      toValue: 1,
    })

  const handleComplete = () => {
    setTimeout(() => {
      goBack()
      handleDone()
    }, 500)
  }

  const handleDone = () => {
    setTimeout(() => {
      onDone()
    }, 200)
  }

  const handleAnimations = () => {
    switch (state) {
      case AusweisScannerState.loading:
        setAnimationState(AusweisScannerState.loading)
        return showAnimation(loadingOpacityValue).start()
      case AusweisScannerState.failure:
        setAnimationState(AusweisScannerState.failure)
        return showAnimation(iconOpacityValue).start(handleDone)
      case AusweisScannerState.success:
        setAnimationState(AusweisScannerState.success)
        return showAnimation(iconOpacityValue).start(handleComplete)
      default:
        setAnimationState(AusweisScannerState.idle)
        return
    }
  }

  useEffect(() => {
    handleAnimations()
  }, [])

  useEffect(() => {
    if (state !== animationState) {
      handleAnimations()
    }
  }, [route, animationState])

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

  const renderScannerIcon = () => {
    switch (state) {
      case AusweisScannerState.idle:
        return <NfcScannerAndroid />
      case AusweisScannerState.failure:
        return (
          <Animated.View
            style={[{ opacity: iconOpacityValue }, styles.successContainer]}
          >
            <ErrorIcon color={Colors.white} />
          </Animated.View>
        )
      case AusweisScannerState.loading:
        return (
          <Animated.View
            style={[{ opacity: loadingOpacityValue }, styles.failedContainer]}
          >
            <Ripple
              color={Colors.white}
              initialValue1={1}
              maxValue1={5}
              maxValue2={5}
              thickness={1}
            />
          </Animated.View>
        )
      case AusweisScannerState.success:
        return (
          <Animated.View
            style={[{ opacity: iconOpacityValue }, styles.failedContainer]}
          >
            <SuccessTick color={Colors.white} />
          </Animated.View>
        )
    }
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
        <View
          style={{
            ...styles.iconContainer,
            ...(state !== AusweisScannerState.idle && styles.statusBorder),
          }}
        >
          {renderScannerIcon()}
        </View>
        <JoloText color={Colors.white} customStyles={styles.footer}>
          {t('AusweisScanner.startSubheader')}
        </JoloText>
      </View>
      <Btn
        disabled={
          state === AusweisScannerState.success ||
          state === AusweisScannerState.failure
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
