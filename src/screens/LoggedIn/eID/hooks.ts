import {
  CommonActions,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { aa2Module } from 'react-native-aa2-sdk'
import NfcManager from 'react-native-nfc-manager'
import { SWErrorCodes } from '~/errors/codes'
import { useCustomContext } from '~/hooks/context'
import { useRedirect, usePopStack, usePop } from '~/hooks/navigation'
import useSettings, { SettingKeys } from '~/hooks/settings'
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

import { LOG } from '~/utils/dev'
import useTranslation from '~/hooks/useTranslation'
import { StackNavigationProp } from '@react-navigation/stack'
import { AusweisStackParamList } from '.'
import { AUSWEIS_SCANNER_NAVIGATION_KEY } from './components/AusweisScanner'
import { AccessRightsFields, CardInfo } from 'react-native-aa2-sdk/js/types'

export const useAusweisContext = useCustomContext(AusweisContext)

export const useCheckNFC = () => {
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

  const checkNfcSupport = (onSuccess: () => void) => {
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
                goToNfcSettings()
              },
            },
          })
        } else {
          scheduleErrorWarning(e)
        }
      })
  }

  const goToNfcSettings = () => {
    NfcManager.goToNfcSetting()
  }

  return { checkNfcSupport }
}

export const useAusweisInteraction = () => {
  const { t } = useTranslation()
  const { scheduleInfo, scheduleErrorWarning } = useToasts()
  const redirect = useRedirect()
  const popStack = usePopStack()

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
      const request: any = await aa2Module.processRequest(token)
      LOG(request)
      const certificate: any = await aa2Module.getCertificate()
      LOG(certificate)

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

      redirect(ScreenNames.eId, requestData)
    } catch (e) {
      console.warn(e)
      scheduleErrorWarning(e)
    }
  }

  const acceptRequest = async (optionalFields: Array<AccessRightsFields>) => {
    await aa2Module.setAccessRights(optionalFields)
    await aa2Module.acceptAuthRequest()
  }

  const disconnectAusweis = () => {
    aa2Module.disconnectAa2Sdk().catch(scheduleErrorWarning)
  }

  const closeAusweis = () => {
    popStack()
  }

  const cancelInteraction = () => {
    aa2Module
      .cancelFlow()
      .catch((e) =>
        console.warn(
          'Ausweis Error: Something happend when canceling interaction',
          e,
        ),
      )
    closeAusweis()
  }

  const checkIfScanned = async () => {
    return aa2Module.checkIfCardWasRead()
  }

  const passcodeCommands = {
    setPin: (pin: string) => aa2Module.enterPin(pin),
    setPuk: (puk: string) => aa2Module.enterPUK(puk),
    setCan: (can: string) => aa2Module.enterCan(can),
  }

  const finishFlow = (url: string) => {
    return fetch(url)
      .then((res) => {
        if (res['ok']) {
          scheduleInfo({
            title: t('Toasts.ausweisSuccessTitle'),
            message: t('Toasts.ausweisSuccessMsg'),
          })
        } else {
          scheduleErrorWarning(new Error(res['statusText']))
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

  return {
    closeAusweis,
    initAusweis,
    checkIfCardValid,
    disconnectAusweis,
    processAusweisToken,
    cancelInteraction,
    acceptRequest,
    checkIfScanned,
    passcodeCommands,
    finishFlow,
  }
}

export const useAusweisCompatibilityCheck = () => {
  const redirect = useRedirect()
  const pop = usePop()
  const [compatibility, setCompatibility] = useState<AusweisCardResult>()

  const startCheck = () => {
    setCompatibility(undefined)
    // @ts-expect-error
    redirect(ScreenNames.eId, { screen: eIDScreens.AusweisScanner, params: {} })
    aa2Module.resetHandlers()
    aa2Module.setHandlers({
      handleCardInfo: (info) => {
        if (info) {
          const { inoperative, deactivated } = info
          setCompatibility({ inoperative, deactivated })

          pop(1)
        }
      },
    })
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

export const useAusweisSkipCompatibility = () => {
  const settings = useSettings()
  const { scheduleErrorWarning } = useToasts()
  const [shouldSkip, setShouldSkipValue] = useState(false)

  useEffect(() => {
    getShouldSkip().then(setShouldSkipValue)
  }, [])

  const getShouldSkip = async () => {
    try {
      const result = await settings.get(SettingKeys.ausweisSkipCompatibility)
      if (!result?.value) return false
      else return result.value as boolean
    } catch (e) {
      console.warn('Failed to get value from storage', e)
      return false
    }
  }

  const setShouldSkip = async (value: boolean) => {
    try {
      await settings.set(SettingKeys.ausweisSkipCompatibility, { value })
      setShouldSkipValue(value)
    } catch (e) {
      console.warn('Failed to get value from storage', e)
      scheduleErrorWarning(e)
    }
  }

  return { shouldSkip, setShouldSkip }
}

export const useTranslatedAusweisFields = () => {
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

  return (field: AusweisFields) => {
    return fieldsMapping[field]
  }
}

export const useAusweisScanner = () => {
  const navigation = useNavigation<StackNavigationProp<AusweisStackParamList>>()
  const defaultState = {
    state: AusweisScannerState.idle,
    onDone: () => {},
  }
  const [scannerParams, setScannerParams] =
    useState<AusweisScannerParams>(defaultState)

  const currentRoute = useNavigationState((state) => state.routes[state.index])

  const getIsScannerActive = () => {
    return currentRoute.key === AUSWEIS_SCANNER_NAVIGATION_KEY
  }

  useEffect(() => {
    if (getIsScannerActive()) {
      navigation.dispatch({
        ...CommonActions.setParams(scannerParams),
        source: AUSWEIS_SCANNER_NAVIGATION_KEY,
      })
    }
  }, [JSON.stringify(scannerParams), JSON.stringify(currentRoute)])

  const resetScanner = () => {
    setScannerParams(defaultState)
  }

  const showScanner = (onDismiss?: () => void) => {
    navigation.navigate({
      name: eIDScreens.AusweisScanner,
      params: { ...scannerParams, onDismiss },
      key: AUSWEIS_SCANNER_NAVIGATION_KEY,
    })
  }

  const updateScanner = (params: AusweisScannerParams) => {
    setScannerParams(params)
    if (
      params.state === AusweisScannerState.failure ||
      params.state === AusweisScannerState.success
    ) {
      setTimeout(() => {
        resetScanner()
      }, 2000)
    }
  }

  return { showScanner, updateScanner, scannerParams }
}
