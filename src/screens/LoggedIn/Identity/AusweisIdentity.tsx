import { aa2Module } from '@jolocom/react-native-ausweis'
import { CardInfo } from '@jolocom/react-native-ausweis/js/types'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { useCheckNFC } from '~/hooks/nfc'
import useTranslation from '~/hooks/useTranslation'
import eIDHooks from '~/screens/Modals/Interaction/eID/hooks'
import {
  AusweisFlow,
  AusweisPasscodeMode,
  AusweisScannerState,
  CardInfoMode,
  eIDScreens,
} from '~/screens/Modals/Interaction/eID/types'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { IS_ANDROID } from '~/utils/generic'
import { IdentityBtn } from './IdentityBtn'

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
    <View style={styles.container} testID="home-ausweis-identity">
      <JoloText
        kind={JoloTextKind.title}
        weight={JoloTextWeight.medium}
        customStyles={styles.header}
      >
        {t('AusweisIdentity.header')}
      </JoloText>
      <View style={styles.cardContainer}>
        <Image
          resizeMode="contain"
          source={require('~/assets/images/cardBanner.png')}
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
        <JoloText
          size={JoloTextSizes.mini}
          customStyles={styles.subheader}
          color={Colors.white70}
        >
          {t('AusweisIdentity.subheader')}
        </JoloText>
        <JoloText
          onPress={handleMoreInfo}
          size={JoloTextSizes.mini}
          color={Colors.activity}
          customStyles={styles.moreBtn}
        >
          {t('General.moreInfo')}
        </JoloText>
        <View style={styles.btnContainer}>
          <IdentityBtn
            title={t('AusweisIdentity.compatibilityBtn')}
            subtitle={t('AusweisIdentity.compatibilityBtnDescription')}
            onPress={handleCompatibility}
            loading={isLoadingCompatibility}
          />
          <IdentityBtn
            title={t('AusweisIdentity.changePinBtn')}
            subtitle={t('AusweisIdentity.changePinBtnDescription')}
            onPress={handleChangePin}
          />
          <IdentityBtn
            title={t('AusweisIdentity.unlockBtn')}
            subtitle={t('AusweisIdentity.unlockBtnDescription')}
            loading={isLoadingUnlock}
            onPress={handleUnlockCard}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: BP({
      large: 0,
      default: 40,
    }),
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 3,
    position: 'relative',
    alignSelf: 'center',
  },
  ausweisBadge: {
    position: 'absolute',
    bottom: 12,
    left: 24,
    fontSize: 16,
    lineHeight: 18.4,
    letterSpacing: 0.15,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  btnContainer: {
    marginTop: BP({ default: 8, large: 16 }),
  },
  header: { textAlign: 'left', marginBottom: 12 },
  subheader: {
    textAlign: 'left',
    paddingHorizontal: 14,
    marginTop: 8,
  },
  moreBtn: {
    textAlign: 'left',
    paddingHorizontal: 14,
    paddingTop: 4,
  },
})
