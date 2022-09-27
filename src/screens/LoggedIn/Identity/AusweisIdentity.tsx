import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { useNavigation } from '@react-navigation/native'
import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import { JoloTextSizes } from '~/utils/fonts'
import { ScreenNames } from '~/types/screens'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import useTranslation from '~/hooks/useTranslation'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
} from '~/screens/Modals/Interaction/eID/types'
import { IS_ANDROID } from '~/utils/generic'
import { useCheckNFC } from '~/hooks/nfc'

export const AusweisIdentity = () => {
  const { t } = useTranslation()
  const { startCheck: startCompatibilityCheck } =
    eIDHooks.useAusweisCompatibilityCheck()
  const checkNfcSupport = useCheckNFC()
  const navigation = useNavigation()
  const { cancelFlow, checkCardValidity, startChangePin } =
    eIDHooks.useAusweisInteraction()
  const { showScanner, updateScanner } = eIDHooks.useAusweisScanner()
  const { handleDeactivatedCard } = eIDHooks.useDeactivatedCard()
  const { usePendingEidHandler } = eIDHooks

  const compatibilityCheck = () => {
    checkNfcSupport(startCompatibilityCheck)
  }

  const unlockCardCheck = () => {
    checkNfcSupport(() => {
      setupUnlockCardHandlers()
      startChangePin()
    })
  }

  const {
    handlePress: handleCompatibility,
    isLoading: isLoadingCompatibility,
  } = usePendingEidHandler(compatibilityCheck)

  const { handlePress: handleUnlockCard, isLoading: isLoadingUnlock } =
    usePendingEidHandler(unlockCardCheck)

  const handleChangePin = () =>
    navigation.navigate(ScreenNames.AusweisChangePin)

  const handleShowCardLockResult = (mode: CardInfoMode) => {
    const navigateToCardInfo = () => {
      navigation.navigate(ScreenNames.TransparentModals, {
        screen: ScreenNames.AusweisCardInfo,
        params: {
          mode,
          onDismiss: cancelFlow,
        },
      })
    }
    if (IS_ANDROID) {
      updateScanner({
        state: AusweisScannerState.success,
        onDone: navigateToCardInfo,
      })
    } else {
      navigateToCardInfo()
    }
  }

  const handleShowPuk = () => {
    navigation.navigate(ScreenNames.Interaction, {
      screen: ScreenNames.eId,
      params: {
        screen: eIDScreens.EnterPIN,
        params: {
          mode: AusweisPasscodeMode.PUK,
          flow: AusweisFlow.unlock,
          handlers: {
            handlePinRequest: () => {
              handleShowCardLockResult(CardInfoMode.unblocked)
            },
          },
        },
      },
    })
  }

  const setupUnlockCardHandlers = () => {
    aa2Module.resetHandlers()
    aa2Module.setHandlers({
      handleCardInfo: (card) => {
        if (card?.deactivated) {
          handleDeactivatedCard()
        }
      },
      handleCardRequest: () => {
        if (IS_ANDROID) {
          showScanner({ onDismiss: cancelFlow })
        }
      },
      handlePinRequest: (card: CardInfo) => {
        checkCardValidity(card, () => {
          handleShowCardLockResult(CardInfoMode.notBlocked)
        })
      },
      handleCanRequest: (card: CardInfo) => {
        checkCardValidity(card, () => {
          handleShowCardLockResult(CardInfoMode.notBlocked)
        })
      },
      handlePukRequest: (card: CardInfo) => {
        checkCardValidity(card, () => {
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
        })
      },
    })
  }

  const handleMoreInfo = () => navigation.navigate(ScreenNames.AusweisMoreInfo)

  return (
    <View
      style={{ marginBottom: BP({ large: 0, default: 40 }) }}
      testID="home-ausweis-identity"
    >
      <View style={styles.cardContainer}>
        <Image
          resizeMode="contain"
          source={require('~/assets/images/updatedCard.png')}
          style={styles.card}
        />
        <JoloText
          color={Colors.black}
          weight={JoloTextWeight.medium}
          customStyles={styles.ausweisBadge}
        >
          {t('AusweisIdentity.ausweisBadge')}
        </JoloText>
      </View>
      <View>
        <JoloText kind={JoloTextKind.title} weight={JoloTextWeight.regular}>
          {t('AusweisIdentity.header')}
        </JoloText>
        <JoloText size={JoloTextSizes.mini} customStyles={{ marginTop: 8 }}>
          {t('AusweisIdentity.subheader')}
          {'\n'}
          <JoloText
            onPress={handleMoreInfo}
            size={JoloTextSizes.mini}
            color={Colors.activity}
          >
            {t('General.moreInfo')}
          </JoloText>
        </JoloText>

        <View style={styles.btnContainer}>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            loading={isLoadingCompatibility}
            onPress={handleCompatibility}
          >
            {t('AusweisIdentity.compatibilityBtn')}
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            onPress={handleChangePin}
          >
            {t('AusweisIdentity.changePinBtn')}
          </Btn>
          <Btn
            type={BtnTypes.secondary}
            customContainerStyles={styles.btn}
            loading={isLoadingUnlock}
            onPress={handleUnlockCard}
          >
            {t('AusweisIdentity.unlockBtn')}
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
    position: 'relative',
  },
  ausweisBadge: {
    position: 'absolute',
    bottom: 23,
    left: 18,
    fontSize: 16,
    lineHeight: 18.4,
    letterSpacing: 0.15,
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
    marginVertical: 1,
  },
  btnContainer: {
    marginTop: BP({ default: 28, large: 42 }),
    paddingVertical: 8,
  },
})
