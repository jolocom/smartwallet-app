import { useEffect, useState } from 'react'
import { aa2Module } from 'react-native-aa2-sdk'
import NfcManager from 'react-native-nfc-manager'
import { SWErrorCodes } from '~/errors/codes'
import { useCustomContext } from '~/hooks/context'
import { useRedirect, usePopStack, usePop } from '~/hooks/navigation'
import useSettings, { SettingKeys } from '~/hooks/settings'
import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { LOG } from '~/utils/dev'
import { AusweisContext } from './context'
import { AusweisCardResult, eIDScreens, IAusweisRequest } from './types'

export const useAusweisContext = useCustomContext(AusweisContext)

export const useCheckNFC = () => {
  const checkNfcSupport = async () => {
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

  const goToNfcSettings = () => {
    NfcManager.goToNfcSetting()
  }

  return { checkNfcSupport, goToNfcSettings }
}

export const useAusweisInteraction = () => {
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

  const acceptRequest = async (optionalFields: Array<string>) => {
    await aa2Module.setAccessRights(optionalFields)
    await aa2Module.acceptAuthRequest()
  }

  const disconnectAusweis = () => {
    try {
      aa2Module.disconnectAa2Sdk()
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  const cancelFlow = async () => {
    aa2Module.cancelFlow().catch(scheduleErrorWarning)
    popStack()
  }

  const checkIfScanned = async () => {
    return aa2Module.checkIfCardWasRead()
  }

  const passcodeCommands = {
    setPin: (pin: number) => aa2Module.enterPin(pin),
    setPuk: (puk: number) => aa2Module.enterPUK(puk),
    setCan: (can: number) => aa2Module.enterCan(can),
  }

  const finishFlow = (url: string) => {
    fetch(url)
      .then((res) => {
        if (res['ok']) {
          scheduleInfo({
            title: 'Success',
            message: 'Successfully shared eID data!',
          })
        } else {
          scheduleErrorWarning(new Error(res['statusText']))
        }
        cancelFlow()
      })
      .catch(scheduleErrorWarning)
  }

  return {
    initAusweis,
    disconnectAusweis,
    processAusweisToken,
    cancelFlow,
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
    redirect(ScreenNames.eId, { screen: eIDScreens.AusweisScanner })
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
