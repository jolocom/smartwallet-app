import {
  RouteProp,
  useIsFocused,
  useNavigationState,
  useRoute,
} from '@react-navigation/core'
import { useBackHandler } from '@react-native-community/hooks'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { setAusweisScannerKey } from '~/modules/interaction/actions'

import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Ripple from '~/components/Ripple'

import { useGoBack } from '~/hooks/navigation'
import { ErrorIcon, NfcScannerAndroid, SuccessTick } from '~/assets/svg'
import { Colors } from '~/utils/colors'

import { AusweisStackParamList } from '..'
import { AusweisBottomSheet } from '../styled'
import { eIDScreens, AusweisScannerState } from '../types'
import { useDispatch } from 'react-redux'
import useTranslation from '~/hooks/useTranslation'

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
  const [animationState, setAnimationState] = useState(AusweisScannerState.idle)
  const dispatch = useDispatch()

  const isScreenFocused = useIsFocused()

  useEffect(() => {
    dispatch(setAusweisScannerKey(isScreenFocused ? route.key : null))
  }, [isScreenFocused])

  useBackHandler(() => {
    return true
  })

  const showAnimation = (value: Animated.Value) =>
    Animated.timing(value, {
      duration: 500,
      useNativeDriver: true,
      toValue: 1,
    })

  const handleComplete = () => {
    setTimeout(() => {
      goBack()
      setTimeout(() => {
        onDone()
      }, 200)
    }, 500)
  }

  useEffect(() => {
    if (state !== animationState) {
      switch (state) {
        case AusweisScannerState.loading:
          setAnimationState(AusweisScannerState.loading)
          return showAnimation(loadingOpacityValue).start()
        case AusweisScannerState.failure:
          setAnimationState(AusweisScannerState.failure)
          return showAnimation(iconOpacityValue).start(handleComplete)
        case AusweisScannerState.success:
          setAnimationState(AusweisScannerState.success)
          return showAnimation(iconOpacityValue).start(handleComplete)
        default:
          return
      }
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
    <AusweisBottomSheet backgroundColor={Colors.badGrey}>
      <View style={styles.container}>
        <JoloText kind={JoloTextKind.title} customStyles={{ marginBottom: 32 }}>
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
    marginTop: -20,
    paddingBottom: 32,
  },
  iconContainer: {
    width: 156,
    height: 156,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 10,
    marginTop: 36,
  },
})
