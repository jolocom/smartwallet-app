import { aa2Module } from 'react-native-aa2-sdk'
import NfcManager from 'react-native-nfc-manager'
import { SWErrorCodes } from '~/errors/codes'
import { useCustomContext } from '~/hooks/context'
import { useDisableLock } from '~/hooks/generic'
import { useRedirect, usePopStack } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { LOG } from '~/utils/dev'
import { AusweisContext } from './context'
import { AusweisPasscodeMode, eIDScreens, IAusweisRequest } from './types'

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
  const disableLock = useDisableLock()
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
    aa2Module.disconnectAa2Sdk().catch(scheduleErrorWarning)
  }

  const cancelInteraction = () => {
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
        cancelInteraction()
      })
      .catch(scheduleErrorWarning)
  }

  return {
    initAusweis,
    disconnectAusweis,
    processAusweisToken,
    cancelInteraction,
    acceptRequest,
    checkIfScanned,
    passcodeCommands,
    finishFlow,
  }
}
