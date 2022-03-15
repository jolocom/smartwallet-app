import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { aa2Module } from '@jolocom/react-native-ausweis'
import NfcManager from 'react-native-nfc-manager'
import {
  AccessRightsFields,
  CardInfo,
} from '@jolocom/react-native-ausweis/js/types'
import {
  Messages,
  ReaderMessage,
} from '@jolocom/react-native-ausweis/js/messageTypes'
import { useSelector, useDispatch } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'

import { SWErrorCodes } from '~/errors/codes'
import { useCustomContext } from '~/hooks/context'
import { useRedirect, usePopStack } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { AusweisContext } from './context'
import {
  eIDScreens,
  IAusweisRequest,
  AusweisFields,
  AusweisScannerState,
  AusweisScannerParams,
  AusweisCardResult,
} from './types'
import useTranslation from '~/hooks/useTranslation'
import {
  setAusweisInteractionDetails,
  setAusweisReaderState,
} from '~/modules/ausweis/actions'
import {
  getAusweisReaderState,
  getAusweisScannerKey,
} from '~/modules/ausweis/selectors'
import useConnection from '~/hooks/connection'
import { IS_ANDROID } from '~/utils/generic'

const useAusweisContext = useCustomContext(AusweisContext)

//NOTE: Does this fit here, or in the general hooks directory?
const useCheckNFC = () => {
  const { t } = useTranslation()
  const { scheduleErrorInfo, scheduleInfo, scheduleErrorWarning } = useToasts()

  const nfcCheck = async () => {
    const supported = await NfcManager.isSupported()

    if (!supported) {
      throw new Error(SWErrorCodes.SWNfcNotSupported)
    }

    await NfcManager.start()
    const isEnabled = await NfcManager.isEnabled()

    if (!isEnabled) {
      throw new Error(SWErrorCodes.SWNfcNotEnabled)
    }
  }

  return (onSuccess: () => void | PromiseLike<void>) =>
    nfcCheck()
      .then(onSuccess)
      .catch((e) => {
        if (e.message === SWErrorCodes.SWNfcNotSupported) {
          scheduleErrorInfo(e, {
            title: t('Toasts.nfcCompatibilityTitle'),
            message: t('Toasts.nfcCompatibilityMsg'),
          })
        } else if (e.message === SWErrorCodes.SWNfcNotEnabled) {
          scheduleInfo({
            title: t('Toasts.nfcOffTitle'),
            message: t('Toasts.nfcOffMsg'),
            interact: {
              label: t('Toasts.nfcOffBtn'),
              onInteract: () => {
                NfcManager.goToNfcSetting()
              },
            },
          })
        } else {
          scheduleErrorWarning(e)
        }
      })
}

const useAusweisInteraction = () => {
  const { t } = useTranslation()
  const { scheduleInfo, scheduleErrorWarning, scheduleWarning } = useToasts()
  const popStack = usePopStack()
  const dispatch = useDispatch()
  const { connected: isConnectedToTheInternet } = useConnection()
  const { showScanner } = eIDHooks.useAusweisScanner()
  const isCardTouched = useSelector(getAusweisReaderState)
  const checkNfc = useCheckNFC()

  /*
   * NOTE: if the card is touching the reader while sending a command which triggers
   * the INSERT_CARD message (based on which we usually show the scanner), we should
   * show the scanner imperatively.
   */
  const shouldShowScannerWithoutInsertMessage = IS_ANDROID && isCardTouched

  // NOTE: Currently the Ausweis SDK is initiated in ~/utils/sdk/context, which doensn't
  // yet have access to the navigation (this hook uses @Toasts, which use navigation). Due
  // to this, the @initAusweis function is not used for initialization. Instead it's used
  // directly in the context. If the intitialization should be moved smwhere inside the
  // navigation container, then we can use this function for intialization.
  const initAusweis = async () => {
    if (!aa2Module.isInitialized) {
      try {
        await aa2Module.initAa2Sdk()
      } catch (e) {
        scheduleErrorWarning(e)
      }
    }
  }

  const processAusweisToken = async (token: string) => {
    try {
      await checkNfc(async () => {
        // NOTE: The types in react-native-ausweis are not entirely accurate, since they
        // set as the return type all the messages that can be handled by the command,
        // even though there are specific messages that will be resolved i.e. startAuth will only
        // resolve only to the AccessRightsMessage, even though it handles both the AuthMessage and Access
        // RightsMessage, which are reflected in the current types.
        const request: any = await aa2Module.startAuth(token)
        const certificate: any = await aa2Module.getCertificate()

        const requestData: IAusweisRequest = {
          requiredFields: request.chat.required,
          optionalFields: request.chat.optional,
          certificateIssuerName: certificate.description.issuerName,
          certificateIssuerUrl: certificate.description.issuerUrl,
          providerName: certificate.description.subjectName,
          providerUrl: certificate.description.subjectUrl,
          providerInfo: certificate.description.termsOfUsage,
          effectiveValidityDate: certificate.validity.effectiveDate,
          expirationDate: certificate.validity.expirationDate,
        }

        dispatch(setAusweisInteractionDetails(requestData))
      })
    } catch (e) {
      cancelFlow()
      console.warn(e)
      scheduleErrorWarning(e)
    }
  }

  const acceptRequest = async (optionalFields: Array<AccessRightsFields>) => {
    if (shouldShowScannerWithoutInsertMessage) {
      showScanner(cancelInteraction, { state: AusweisScannerState.loading })
    }

    await aa2Module.setAccessRights(optionalFields)
    await aa2Module.acceptAuthRequest()
  }

  const disconnectAusweis = () => {
    aa2Module.disconnectAa2Sdk().catch(scheduleErrorWarning)
  }

  const closeAusweis = () => {
    popStack()
  }

  const sendCancel = () => {
    aa2Module
      .cancelFlow()
      .catch((e) =>
        console.warn(
          'Ausweis Error: Something happend when canceling interaction',
          e,
        ),
      )
  }

  /**
   * sends CANCEL cmd and pops the stack (too many times though!!!)
   */
  const cancelInteraction = () => {
    sendCancel()
    closeAusweis()
  }

  /**
   * sends CANCEL cmd
   */
  const cancelFlow = () => {
    sendCancel()
  }

  const checkIfScanned = async () => aa2Module.checkIfCardWasRead()

  const passcodeCommands = {
    setNewPin: (pin: string) => aa2Module.setNewPin(pin),
    setPin: (pin: string) => aa2Module.setPin(pin),
    setPuk: (puk: string) => aa2Module.setPuk(puk),
    setCan: (can: string) => aa2Module.setCan(can),
  }

  const finishFlow = (url: string, message?: string) => {
    if (isConnectedToTheInternet === false) {
      return Promise.reject('No internet connection')
    }
    return fetch(url)
      .then((res) => {
        if (!res['ok']) {
          throw new Error(
            `could not send the request to the url: ${url}, ${message}`,
          )
        }
        if (!message) {
          scheduleInfo({
            title: t('Toasts.ausweisSuccessTitle'),
            message: t('Toasts.ausweisSuccessMsg'),
            dismiss: 10000,
          })
        }
      })
      .catch(scheduleErrorWarning)
  }

  const checkIfCardValid = (card: CardInfo) => {
    if (card.deactivated || card.inoperative) {
      return false
    }

    return true
  }

  const checkCardValidity = (card: CardInfo, onValidCard: () => void) => {
    if (checkIfCardValid(card)) {
      onValidCard()
    } else {
      cancelInteraction()
      scheduleWarning({
        title: t('Toasts.ausweisFailedCheckTitle'),
        message: t('Toasts.ausweisFailedCheckMsg'),
        interact: {
          label: t('Toasts.ausweisFailedCheckBtn'),
          // TODO: add handler
          onInteract: () => {},
        },
      })
    }
  }

  const startChangePin = async () => {
    if (shouldShowScannerWithoutInsertMessage) {
      showScanner(cancelFlow, { state: AusweisScannerState.loading })
    }

    await aa2Module.startChangePin().catch(scheduleErrorWarning)
  }

  return {
    closeAusweis,
    initAusweis,
    disconnectAusweis,
    processAusweisToken,
    cancelInteraction,
    cancelFlow,
    acceptRequest,
    checkIfScanned,
    passcodeCommands,
    finishFlow,
    checkCardValidity,
    startChangePin,
  }
}

const useAusweisCompatibilityCheck = () => {
  const redirect = useRedirect()
  const [compatibility, setCompatibility] = useState<AusweisCardResult>()
  const { showScanner, updateScanner } = eIDHooks.useAusweisScanner()
  const { cancelFlow, startChangePin } = eIDHooks.useAusweisInteraction()
  const { checkNfcSupport } = eIDHooks.useCheckNFC()
  const readerState = useSelector(getAusweisReaderState)

  const updateCompatibilityResult = (cardInfo: CardInfo) => {
    const { inoperative, deactivated } = cardInfo

    setCompatibility({ inoperative, deactivated })
  }

  const checkAndroidCompatibility = () => {
    if (readerState) {
      showScanner(undefined, {
        state: AusweisScannerState.success,
        onDone: () => updateCompatibilityResult(readerState),
      })
    } else {
      showScanner()
      aa2Module.setHandlers({
        handleCardInfo: (info) => {
          if (info) {
            updateScanner({
              state: AusweisScannerState.success,
              onDone: () => updateCompatibilityResult(info),
            })
          }
        },
      })
    }
  }

  const checkIosCompatibility = () => {
    aa2Module.resetHandlers()
    aa2Module.setHandlers({
      handleCardInfo: (info) => {
        if (info) {
          const { inoperative, deactivated } = info
          // NOTE: The timeout is here to assure the compatibility screen appears after the native
          // scanner was hidden.
          setTimeout(() => {
            setCompatibility({ inoperative, deactivated })
            cancelFlow()
          }, 3000)
        }
      },
    })

    startChangePin()
  }
  const startCheck = () => {
    setCompatibility(undefined)
    checkNfcSupport(
      Platform.select({
        ios: checkIosCompatibility,
        android: checkAndroidCompatibility,
        default: checkAndroidCompatibility,
      }),
    )
  }

  useEffect(() => {
    if (compatibility) {
      aa2Module.resetHandlers()
      redirect(ScreenNames.eId, {
        // @ts-expect-error
        screen: eIDScreens.CompatibilityResult,
        params: compatibility,
      })
    }
  }, [JSON.stringify(compatibility)])

  return { startCheck, compatibility }
}

const useTranslatedAusweisFields = () => {
  const { t } = useTranslation()

  const fieldsMapping: { [x in AusweisFields]: string } = {
    [AusweisFields.Address]: t('Ausweis.address'),
    [AusweisFields.BirthName]: t('Ausweis.birthName'),
    [AusweisFields.FamilyName]: t('Ausweis.familyName'),
    [AusweisFields.GivenNames]: t('Ausweis.givenNames'),
    [AusweisFields.PlaceOfBirth]: t('Ausweis.placeOfBirth'),
    [AusweisFields.DateOfBirth]: t('Ausweis.dateOfBirth'),
    [AusweisFields.DoctoralDegree]: t('Ausweis.doctoralDegree'),
    [AusweisFields.ArtisticName]: t('Ausweis.artisticName'),
    [AusweisFields.Pseudonym]: t('Ausweis.pseudonym'),
    [AusweisFields.ValidUntil]: t('Ausweis.validUntil'),
    [AusweisFields.Nationality]: t('Ausweis.nationality'),
    [AusweisFields.IssuingCountry]: t('Ausweis.issuingCountry'),
    [AusweisFields.DocumentType]: t('Ausweis.documentType'),
    [AusweisFields.ResidencePermitI]: t('Ausweis.residencePermitI'),
    [AusweisFields.ResidencePermitII]: t('Ausweis.residencePermitII'),
    [AusweisFields.CommunityID]: t('Ausweis.communityID'),
    [AusweisFields.AddressVerification]: t('Ausweis.addressVerification'),
    [AusweisFields.AgeVerification]: t('Ausweis.ageVerification'),
    [AusweisFields.WriteAddress]: t('Ausweis.writeAddress'),
    [AusweisFields.WriteCommunityID]: t('Ausweis.writeCommunityID'),
    [AusweisFields.WriteResidencePermitI]: t('Ausweis.writeResidencePermitI'),
    [AusweisFields.WriteResidencePermitII]: t('Ausweis.writeResidencePermitII'),
    [AusweisFields.CanAllowed]: t('Ausweis.canAllowed'),
    [AusweisFields.PinManagement]: t('Ausweis.pinManagement'),
  }

  return (field: AusweisFields) => fieldsMapping[field]
}

export const useDeactivatedCard = () => {
  const { updateScanner } = useAusweisScanner()
  const { scheduleWarning } = useToasts()
  const { t } = useTranslation()

  const handleDeactivatedCard = () => {
    if (IS_ANDROID) {
      updateScanner({
        state: AusweisScannerState.failure,
        onDone: () => {
          scheduleWarning({
            title: t('Toasts.ausweisDeactivatedCardTitle'),
            message: t('Toasts.ausweisDeactivatedCardMsg'),
          })
        },
      })
    } else {
      scheduleWarning({
        title: t('Toasts.ausweisDeactivatedCardTitle'),
        message: t('Toasts.ausweisDeactivatedCardMsg'),
      })
    }
  }
  return { handleDeactivatedCard }
}

export const useAusweisScanner = () => {
  const navigation = useNavigation()
  const defaultState = {
    state: AusweisScannerState.idle,
    onDone: () => {},
  }

  const scannerKey = useSelector(getAusweisScannerKey)
  const scannerKeyRef = useRef(scannerKey)

  useEffect(() => {
    scannerKeyRef.current = scannerKey
  }, [scannerKey])

  const dispatchScannerParams = (params: AusweisScannerParams) => {
    if (scannerKeyRef.current) {
      try {
        navigation.dispatch({
          ...CommonActions.setParams({ ...params }),
          source: scannerKeyRef.current,
        })
      } catch (e) {
        console.warn(e)
      }
    }
  }

  const resetScanner = () => {
    dispatchScannerParams(defaultState)
  }

  const showScanner = (
    onDismiss?: () => void,
    params?: AusweisScannerParams,
  ) => {
    navigation.navigate(ScreenNames.eId, {
      screen: eIDScreens.AusweisScanner,
      params: { ...params, onDismiss },
    })
  }

  const updateScanner = (params: Partial<AusweisScannerParams>) => {
    dispatchScannerParams({ ...params })
    if (
      params.state === AusweisScannerState.failure ||
      params.state === AusweisScannerState.success
    ) {
      setTimeout(() => {
        resetScanner()
      }, 2000)
    }
  }

  return { showScanner, updateScanner }
}

const useAusweisCancelBackHandler = () => {
  const isFocused = useIsFocused()
  const { cancelInteraction } = eIDHooks.useAusweisInteraction()

  useBackHandler(() => {
    if (isFocused) {
      cancelInteraction()
      return true
    }

    return false
  })
}

const useAusweisReaderEvents = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const listener = (message: ReaderMessage) => {
      dispatch(setAusweisReaderState(message.card))
    }

    aa2Module.messageEmitter.addListener(Messages.reader, listener)

    return () => {
      aa2Module.messageEmitter.removeListener(Messages.reader, listener)
    }
  }, [])
}

const eIDHooks = {
  useAusweisReaderEvents,
  useAusweisCancelBackHandler,
  useAusweisScanner,
  useDeactivatedCard,
  useTranslatedAusweisFields,
  useAusweisCompatibilityCheck,
  useAusweisInteraction,
  useCheckNFC,
  useAusweisContext,
}
export default eIDHooks
