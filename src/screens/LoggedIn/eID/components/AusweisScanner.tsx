import { RouteProp, useRoute } from '@react-navigation/core'
import { useBackHandler } from '@react-native-community/hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, Animated, ActivityIndicator } from 'react-native'
import { aa2Module } from 'react-native-aa2-sdk'
import { ErrorIcon, NfcScannerAndroid, SuccessTick } from '~/assets/svg'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useGoBack } from '~/hooks/navigation'
import { Colors } from '~/utils/colors'
import { generateRandomString } from '~/utils/stringUtils'
import { AusweisStackParamList } from '..'
import { AusweisBottomSheet } from '../styled'
import { eIDScreens, AusweisScannerState } from '../types'

export const AUSWEIS_SCANNER_NAVIGATION_KEY = `AusweisScanner-${generateRandomString(
  10,
)}`

export const AusweisScanner = () => {
  const route =
    useRoute<RouteProp<AusweisStackParamList, eIDScreens.AusweisScanner>>()
  const { onDone = () => {}, state = AusweisScannerState.idle } = route.params
  const goBack = useGoBack()
  const opacityValue = useRef(new Animated.Value(0)).current

  useBackHandler(() => {
    return true
  })

  useEffect(() => {
    console.log({ state })
    switch (state) {
      case AusweisScannerState.loading:
        return showLoading()
      case AusweisScannerState.failure:
        handleDismiss()
        return showFailed()
      case AusweisScannerState.success:
        handleDismiss()
        return showSuccess()
      default:
        return
    }
  }, [route])

  const showSuccess = () => {
    Animated.timing(opacityValue, {
      duration: 500,
      useNativeDriver: true,
      toValue: 1,
    }).start()
  }

  const showFailed = () => {
    Animated.timing(opacityValue, {
      duration: 300,
      useNativeDriver: true,
      toValue: 1,
    }).start()
  }

  const showLoading = () => {
    Animated.timing(opacityValue, {
      duration: 300,
      useNativeDriver: true,
      toValue: 1,
    }).start()
  }

  const handleDismiss = () => {
    setTimeout(() => {
      goBack()
    }, 1000)

    //FIXME: should only be called if the scanning was successful
    setTimeout(() => {
      onDone()
    }, 1500)
  }

  const renderScannerIcon = () => {
    switch (state) {
      case AusweisScannerState.idle:
        return <NfcScannerAndroid />
      case AusweisScannerState.failure:
        return (
          <Animated.View
            style={[{ opacity: opacityValue }, styles.successContainer]}
          >
            <ErrorIcon color={Colors.white} />
          </Animated.View>
        )
      case AusweisScannerState.loading:
        return (
          <Animated.View
            style={[{ opacity: opacityValue }, styles.failedContainer]}
          >
            <JoloText>Loading</JoloText>
          </Animated.View>
        )
      case AusweisScannerState.success:
        return (
          <Animated.View
            style={[{ opacity: opacityValue }, styles.failedContainer]}
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
          Ready to Scan
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
          Please do not remove your card until current step is done
        </JoloText>
      </View>
      <Btn
        disabled={state !== AusweisScannerState.idle}
        type={BtnTypes.senary}
        onPress={handleDismiss}
      >
        Cancel
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
