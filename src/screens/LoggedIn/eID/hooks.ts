import { aa2Module } from 'react-native-aa2-sdk'
import NfcManager from 'react-native-nfc-manager'
import { SWErrorCodes } from '~/errors/codes'
import { useCustomContext } from '~/hooks/context'
import { useDisableLock } from '~/hooks/generic'
import { useRedirect, usePopStack } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { AusweisContext } from './context'
import { AusweisFields, IAusweisRequest } from './types'

import { LOG } from '~/utils/dev'
import useTranslation from '~/hooks/useTranslation'

export const useAusweisContext = useCustomContext(AusweisContext)

export const useCheckNFC = () => {
  const { scheduleInfo } = useToasts()

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

  const scheduleDisabledNfcToast = () => {
    scheduleInfo({
      title: 'Please turn on NFC',
      message: 'Please go to the settings and enable NFC',
      interact: {
        label: 'Settings',
        onInteract: () => {
          goToNfcSettings()
        },
      },
    })
  }

  return { checkNfcSupport, goToNfcSettings, scheduleDisabledNfcToast }
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

export const useTranslatedAusweisFields = () => {
  const { t } = useTranslation()

  const fieldsMapping: { [x in AusweisFields]: string } = {
    [AusweisFields.Address]: t('ausweis.address'),
    [AusweisFields.BirthName]: t('ausweis.birthName'),
    [AusweisFields.FamilyName]: t('ausweis.familyName'),
    [AusweisFields.GivenNames]: t('ausweis.givenNames'),
    [AusweisFields.PlaceOfBirth]: t('ausweis.placeOfBirth'),
    [AusweisFields.DateOfBirth]: t('ausweis.dateOfBirth'),
    [AusweisFields.DoctoralDegree]: t('ausweis.doctoralDegree'),
    [AusweisFields.ArtisticName]: t('ausweis.artisticName'),
    [AusweisFields.Pseudonym]: t('ausweis.pseudonym'),
    [AusweisFields.ValidUntil]: t('ausweis.validUntil'),
    [AusweisFields.Nationality]: t('ausweis.nationality'),
    [AusweisFields.IssuingCountry]: t('ausweis.issuingCountry'),
    [AusweisFields.DocumentType]: t('ausweis.documentType'),
    [AusweisFields.ResidencePermitI]: t('ausweis.residencePermitI'),
    [AusweisFields.ResidencePermitII]: t('ausweis.residencePermitII'),
    [AusweisFields.CommunityID]: t('ausweis.communityID'),
    [AusweisFields.AddressVerification]: t('ausweis.addressVerification'),
    [AusweisFields.AgeVerification]: t('ausweis.ageVerification'),
    [AusweisFields.WriteAddress]: t('ausweis.writeAddress'),
    [AusweisFields.WriteCommunityID]: t('ausweis.writeCommunityID'),
    [AusweisFields.WriteResidencePermitI]: t('ausweis.writeResidencePermitI'),
    [AusweisFields.WriteResidencePermitII]: t('ausweis.writeResidencePermitII'),
    [AusweisFields.CanAllowed]: t('ausweis.canAllowed'),
    [AusweisFields.PinManagement]: t('ausweis.pinManagement'),
  }

  return (field: AusweisFields) => {
    return fieldsMapping[field]
  }
}
