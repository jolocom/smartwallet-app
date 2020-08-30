import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  AppStateStatus,
} from 'react-native'

import I18n from 'src/locales/i18n'

import PasscodeInput from './PasscodeInput'
import ScreenContainer from './components/ScreenContainer'
import Header from './components/Header'
import Btn, { BtnTypes } from './components/Btn'
import LocalModal from './LocalModal'
import useGetStoredAuthValues from './hooks/useGetStoredAuthValues'

import strings from '../../locales/strings'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers'
import { useAppState } from './hooks/useAppState'
import { ThunkDispatch } from 'src/store'
import AbsoluteBottom from './components/AbsoluteBottom'
import { accountActions } from 'src/actions'
import useKeyboardHeight from './hooks/useKeyboardHeight'

interface LockI {
  unlockApplication: () => void
  navigateTorecoveryInstuction: () => void
}

const Lock: React.FC<LockI> = ({
  unlockApplication,
  navigateTorecoveryInstuction,
}) => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  const { isLoadingStorage, keychainPin } = useGetStoredAuthValues()
  const { keyboardHeight } = useKeyboardHeight()

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  const handleAppUnlock = () => {
    if (keychainPin === pin) {
      unlockApplication()
    } else {
      setHasError(true)
    }
  }

  return (
    <LocalModal isVisible>
      <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
        {isLoadingStorage ? (
          <ActivityIndicator />
        ) : (
          <>
            <Header customStyles={{ paddingTop: 100 }}>
              {I18n.t(strings.ENTER_YOUR_PIN)}
            </Header>
            <View style={styles.inputContainer}>
              <PasscodeInput
                value={pin}
                stateUpdaterFn={setPin}
                onSubmit={handleAppUnlock}
                hasError={hasError}
                errorStateUpdaterFn={setHasError}
              />
            </View>
            <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
              <Btn
                type={BtnTypes.secondary}
                onPress={navigateTorecoveryInstuction}>
                {I18n.t(strings.FORGOT_YOUR_PIN)}
              </Btn>
            </AbsoluteBottom>
          </>
        )}
      </ScreenContainer>
    </LocalModal>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
})

const mapStateToProps = (state: RootState) => ({
  isLocalAuthSet: state.account.appState.isLocalAuthSet,
  isPopup: state.account.appState.isPopup,
  isAppLocked: state.account.appState.isAppLocked,
  isLockVisible: state.account.appState.isLockVisible,
  did: state.account.did.did,
  isPINInstructionVisible: state.account.appState.isPINInstructionVisible,
})
const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  setPopupState: (value: boolean) => dispatch(accountActions.setPopup(value)),
  lockApplication: () => dispatch(accountActions.lockApp()),
  unlockApplication: () => dispatch(accountActions.unlockApp()),
  navigateTorecoveryInstuction: () => {
    dispatch(accountActions.closeLock())
    dispatch(accountActions.openPINinstructions())
  },
})

type LockContainerProps = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  ({
    did,
    isLocalAuthSet,
    isAppLocked,
    isPopup,
    isLockVisible,
    isPINInstructionVisible,
    lockApplication,
    setPopupState,
    unlockApplication,
    navigateTorecoveryInstuction,
  }: LockContainerProps) => {
    const isPopupRef = useRef<boolean>(isPopup)

    useEffect(() => {
      isPopupRef.current = isPopup
    }, [isPopup])

    useAppState((appState: AppStateStatus, nextAppState: AppStateStatus) => {
      if (
        (Platform.OS === 'ios' &&
          appState.match(/inactive|active/) &&
          nextAppState.match(/background/)) ||
        (Platform.OS === 'android' &&
          appState.match(/inactive|background/) &&
          nextAppState.match(/active/))
      ) {
        console.log('popup', isPopupRef.current)
        if (!isPopupRef.current) lockApplication()
        else setPopupState(false)
      }

      appState = nextAppState
    })
    if (
      did &&
      isLocalAuthSet &&
      isAppLocked &&
      isLockVisible &&
      !isPINInstructionVisible
    ) {
      return (
        <Lock
          unlockApplication={unlockApplication}
          navigateTorecoveryInstuction={navigateTorecoveryInstuction}
        />
      )
    }
    return null
  },
)
