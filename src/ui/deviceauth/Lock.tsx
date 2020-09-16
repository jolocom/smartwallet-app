import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'

import { NavigationInjectedProps } from 'react-navigation'

import I18n from 'src/locales/i18n'

import PasscodeInput from './PasscodeInput'
import Btn, { BtnTypes } from './components/Btn'

import strings from '../../locales/strings'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'
import { ThunkDispatch } from 'src/store'
import { genericActions, navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { Wrapper } from '../structure'

import useDisableBackButton from './hooks/useDisableBackButton'
import PasscodeWrapper from './components/PasscodeWrapper'
import PasscodeHeader from './PasscodeHeader'

interface LockProps
  extends NavigationInjectedProps,
    ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

const Lock: React.FC<LockProps> = ({
  navigateTorecoveryInstuction,
  unlockApp,
  navigation,
  isLocked,
}) => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  let errorTimeout: number

  useDisableBackButton(
    useCallback(() => {
      // don't let react-navigation handle this back button press
      // if the app is locked and the lock is focused
      return isLocked && navigation.isFocused()
    }, [isLocked]),
  )

  useEffect(() => {
    if (!isLocked) navigation.goBack()

    // don't let react-navigation handle this back button press
    // if the app is locked and the lock is focused
    const handleBack = () => isLocked && navigation.isFocused()

    BackHandler.addEventListener('hardwareBackPress', handleBack)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack)
      if (errorTimeout) clearTimeout(errorTimeout)
    }
  }, [isLocked])

  const handleAppUnlock = async () => {
    await unlockApp(pin)
    // unlockApp() should navigate away, if it hasn't then something is wrong.
    // this is in a timeout to not show error immediately
    errorTimeout = setTimeout(() => setHasError(true), 100)
  }

  return (
    <Wrapper secondaryDark>
      <PasscodeWrapper>
        <PasscodeHeader>{I18n.t(strings.ENTER_YOUR_PIN)}</PasscodeHeader>
        <View style={styles.inputContainer}>
          <PasscodeInput
            value={pin}
            stateUpdaterFn={setPin}
            onSubmit={handleAppUnlock}
            hasError={hasError}
            errorStateUpdaterFn={setHasError}
          />
        </View>
        <Btn
          customContainerStyles={{ marginTop: 30 }}
          type={BtnTypes.secondary}
          onPress={navigateTorecoveryInstuction}>
          {I18n.t(strings.FORGOT_YOUR_PIN)}
        </Btn>
      </PasscodeWrapper>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
})

const mapStateToProps = (state: RootState) => ({
  isLocked: state.generic.locked,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  unlockApp: (pin: string) => dispatch(genericActions.unlockApp(pin)),
  navigateTorecoveryInstuction: () => {
    dispatch(
      navigationActions.navigate({ routeName: routeList.HowToChangePIN }),
    )
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Lock)
