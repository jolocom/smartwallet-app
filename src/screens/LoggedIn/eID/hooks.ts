import { aa2Module } from 'react-native-aa2-sdk'
import NfcManager from 'react-native-nfc-manager'
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
  return async () => {
    const supported = await NfcManager.isSupported()
    console.log('supported', supported)

    if (supported) {
      await NfcManager.start()
    } else {
      throw new Error('NFC not supported')
    }
    const isEnabled = await NfcManager.isEnabled()
    console.log({ isEnabled })

    if (!isEnabled) {
      throw new Error('NFC is not enabled')
    }
  }
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
