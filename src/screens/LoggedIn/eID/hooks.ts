import { aa2Module } from 'react-native-aa2-sdk'
import NfcManager from 'react-native-nfc-manager'
import { useCustomContext } from '~/hooks/context'
import { useRedirect, usePopStack } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { LOG } from '~/utils/dev'
import { AusweisContext } from './context'
import { IAusweisRequest } from './types'

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
  const { scheduleErrorWarning } = useToasts()
  const redirect = useRedirect()
  const popStack = usePopStack()

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
    return aa2Module.acceptAuthRequest()
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

  return {
    initAusweis,
    disconnectAusweis,
    processAusweisToken,
    cancelFlow,
    acceptRequest,
    checkIfScanned,
  }
}
