import {
  CommonActions,
  StackActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { aa2Module } from '@jolocom/react-native-ausweis'
import {
  AccessRightsFields,
  CardInfo,
} from '@jolocom/react-native-ausweis/js/types'
import {
  AuthMessage,
  ChangePinMessage,
  Messages,
  ReaderMessage,
} from '@jolocom/react-native-ausweis/js/messageTypes'
import { useSelector, useDispatch } from 'react-redux'
import { useBackHandler } from '@react-native-community/hooks'
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
  AusweisFlow,
} from './types'
import useTranslation from '~/hooks/useTranslation'
import {
  setAusweisFlowType,
  setAusweisInteractionDetails,
  setAusweisReaderState,
} from '~/modules/interaction/actions'
import {
  getAusweisReaderState,
  getAusweisScannerKey,
} from '~/modules/interaction/selectors'
import useConnection from '~/hooks/connection'
import { IS_ANDROID } from '~/utils/generic'
import { useCheckNFC } from '~/hooks/nfc'
import { getRedirectUrl } from '~/modules/interaction/selectors'

const useAusweisContext = useCustomContext(AusweisContext)

const useAusweisInteraction = () => {
  const { t } = useTranslation()
  const { scheduleInfo, scheduleErrorWarning, scheduleWarning } = useToasts()
  const popStack = usePopStack()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { connected: isConnectedToTheInternet } = useConnection()
  const { showScanner } = eIDHooks.useAusweisScanner()
  const { providerName } = eIDHooks.useAusweisContext()
  const isCardTouched = useSelector(getAusweisReaderState)
  const checkNfc = useCheckNFC()
  const redirectUrl = useSelector(getRedirectUrl)

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

  const startChangePin = async () => {
    if (shouldShowScannerWithoutInsertMessage) {
      showScanner(cancelFlow, { state: AusweisScannerState.loading })
    }

    await aa2Module.startChangePin().catch(scheduleErrorWarning)
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
    closeAusweis()
    sendCancel()
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

  const finishFlow = async (url: string) => {
    if (isConnectedToTheInternet === false) {
      throw new Error('No internet connection')
    }

    const handleCompleteFlow = () => {
      closeAusweis()
      navigation.navigate(ScreenNames.Identity)
      scheduleInfo({
        title: t('Toasts.ausweisSuccessTitle'),
        message: t('Toasts.ausweisSuccessMsg'),
        dismiss: 10000,
      })
    }

    return fetch(url)
      .then((res) => {
        if (!redirectUrl) {
          handleCompleteFlow()
        } else {
          const url = new URL(redirectUrl)
          url.searchParams.append('redirectUrl', encodeURIComponent(res.url))

          navigation.dispatch(
            StackActions.replace(ScreenNames.ServiceRedirect, {
              redirectUrl: url.href,
              counterparty: {
                serviceName: providerName,
                isAnonymous: false,
              },
              completeRedirect: handleCompleteFlow,
              closeOnComplete: true,
            }),
          )
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
  const checkNfcSupport = useCheckNFC()
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
      redirect(ScreenNames.Interaction, {
        screen: ScreenNames.eId,
        params: {
          screen: eIDScreens.CompatibilityResult,
          params: compatibility,
        },
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
    navigation.navigate(ScreenNames.Interaction, {
      screen: ScreenNames.eId,
      params: {
        screen: eIDScreens.AusweisScanner,
        params: { ...params, onDismiss },
      },
    })
  }

  const showScannerEid = (
    onDismiss?: () => void,
    params?: AusweisScannerParams,
  ) => {
    navigation.navigate(ScreenNames.eId, {
      screen: eIDScreens.AusweisScanner,
      params: {
        ...params,
        onDismiss: () => {
          onDismiss && onDismiss()
        },
      },
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

  return { showScanner, updateScanner, showScannerEid }
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

// NOTE: This hook is used to update the state of the Ausweis flow type that is currently running.
// Furthermore, it allows to disable certain buttons that start a flow in case the previous flow was
// finished, which otherwise might result in unexpected behavior (the buttons being locked out).
export const useObserveAusweisFlow = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const changePinListener = (msg: ChangePinMessage) => {
      if (msg.hasOwnProperty('success')) {
        // NOTE: We're using a timeout because even though we received the CHANGE_PIN message, which
        // signifies the ending of the flow, sending the RUN_CHANGE_PIN command right away will will
        // not prompt the native scanner. This is an issue on the AA2's side. Finally, 1500 ms seems to
        // be more or less enough time to be able to start the flow again successfully.
        setTimeout(() => {
          dispatch(setAusweisFlowType(null))
        }, 1500)
      } else {
        dispatch(setAusweisFlowType(AusweisFlow.changePin))
      }
    }

    const authListener = (msg: AuthMessage) => {
      const isFlowFinished = !!(msg.result && !msg.result.message) ?? false
      const isFlowFailed = !!msg.error || (msg.result && msg.result.message)

      if (isFlowFailed || isFlowFinished) {
        dispatch(setAusweisFlowType(null))
      } else {
        dispatch(setAusweisFlowType(AusweisFlow.auth))
      }
    }

    aa2Module.messageEmitter.addListener(Messages.changePin, changePinListener)
    aa2Module.messageEmitter.addListener(Messages.auth, authListener)

    return () => {
      aa2Module.messageEmitter.removeListener(
        Messages.changePin,
        changePinListener,
      )
      aa2Module.messageEmitter.removeListener(Messages.auth, authListener)
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
  useAusweisContext,
  useObserveAusweisFlow,
}

export default eIDHooks
