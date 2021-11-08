import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import { useNavigation } from '@react-navigation/core'
import { ScreenNames } from '~/types/screens'
import {
  useAusweisCompatibilityCheck,
  useAusweisInteraction,
  useAusweisScanner,
  useCheckNFC,
} from '~/screens/LoggedIn/eID/hooks'
import { aa2Module } from 'react-native-aa2-sdk'
import {
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
} from '../eID/types'
import { IS_ANDROID } from '~/utils/generic'
import { setPopup } from '~/modules/appState/actions'
import { useDispatch } from 'react-redux'

export const AusweisIdentity = () => {
  const { startCheck: startCompatibilityCheck } = useAusweisCompatibilityCheck()
  const { checkNfcSupport } = useCheckNFC()
  const navigation = useNavigation()
  const { cancelFlow } = useAusweisInteraction()
  const dispatch = useDispatch()
  const { showScanner, updateScanner } = useAusweisScanner()

  const handleCompatibilityCheck = () => {
    checkNfcSupport(startCompatibilityCheck)
  }

  const handleChangePin = () => {
    navigation.navigate(ScreenNames.AusweisChangePin)
  }

  const handleShowCardLockResult = (mode: CardInfoMode) => {
    /**
     * NOTE: replacing for now until fixing issue with getting active route,
     * which is happening when we updating params of the Scanner screen
     * @AusweisScanner
     */
    navigation.navigate(ScreenNames.TransparentModals, {
      screen: ScreenNames.AusweisCardInfo,
      params: {
        mode,
        onDismiss: cancelFlow,
      },
    })
  }

  const handleShowPuk = () => {
    navigation.navigate(ScreenNames.eId, {
      screen: eIDScreens.EnterPIN,
      params: {
        mode: AusweisPasscodeMode.PUK,
        handlers: {
          handlePinRequest: () => {
            handleShowCardLockResult(CardInfoMode.unblocked)
          },
        },
      },
    })
  }

  const setUpUnlockCardHandlers = () => {
    aa2Module.resetHandlers()
    aa2Module.setHandlers({
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner(cancelFlow)
        }
      },
      handlePinRequest: () => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              handleShowCardLockResult(CardInfoMode.notBlocked)
            },
          })
        } else {
          handleShowCardLockResult(CardInfoMode.notBlocked)
        }
      },
      handleCanRequest: () => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              handleShowCardLockResult(CardInfoMode.notBlocked)
            },
          })
        } else {
          handleShowCardLockResult(CardInfoMode.notBlocked)
        }
      },
      handlePukRequest: () => {
        if (IS_ANDROID) {
          updateScanner({
            state: AusweisScannerState.success,
            onDone: () => {
              handleShowPuk()
            },
          })
        } else {
          handleShowPuk()
        }
      },
    })
  }

  const handleUnlockCard = () => {
    if (Platform.OS === 'ios') {
      dispatch(setPopup(true))
    }
    setUpUnlockCardHandlers()
    aa2Module.changePin()
  }

  return (
    <View
      style={{ marginBottom: BP({ large: 0, default: 80 }) }}
      testID="home-ausweis-identity"
    >
      <View style={styles.cardContainer}>
        <Image
          resizeMode="contain"
          source={require('~/assets/images/updatedCard.png')}
          style={styles.card}
        />
      </View>
      <View>
        <JoloText kind={JoloTextKind.title} weight={JoloTextWeight.regular}>
          Manage your digital identity
        </JoloText>
        <JoloText
          size={JoloTextSizes.mini}
          customStyles={{ marginTop: 8, marginHorizontal: 16 }}
        >
          All the necessary functions that will allow you to quickly and easily
          solve frequently asked questions
        </JoloText>

        <View style={styles.btnContainer}>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleCompatibilityCheck}
          >
            Compatibility check
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleChangePin}
          >
            Change your PIN
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleUnlockCard}
          >
            Unlock blocked card
          </Btn>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    aspectRatio: 1.55,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    transform: [{ scale: 1.1 }],
  },
  btn: {
    borderWidth: 1,
    borderColor: Colors.borderGray20,
  },
  btnContainer: {
    marginTop: BP({ default: 36, large: 84 }),
  },
})
