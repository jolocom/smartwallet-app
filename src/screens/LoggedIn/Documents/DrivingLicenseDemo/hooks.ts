import _ from 'lodash'
import { useRef } from 'react'
import { CredentialMetadataSummary } from 'react-native-jolocom'
import DrivingLicenseSDK, {
  DrivingLicenseData,
  DrivingLicenseError,
  DrivingLicenseEvents,
  EngagementState,
  EngagementStateNames,
  PersonalizationInputRequest,
  PersonalizationInputResponse,
} from 'react-native-mdl'
import { useDispatch, useSelector } from 'react-redux'
import { useInitDocuments } from '~/hooks/documents'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { useToasts } from '~/hooks/toasts'
import { addCredentials } from '~/modules/credentials/actions'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { setMdlDisplayData } from '~/modules/mdl/actions'
import { getMdlDisplayData } from '~/modules/mdl/selectors'
import { ScreenNames } from '~/types/screens'
import { makeMdlManifest, mdlMetadata } from './data'
import { utf8ToBase64Image } from './utils'

export const useDrivingLicense = () => {
  const agent = useAgent()
  const sdk = useRef(new DrivingLicenseSDK()).current
  const { scheduleWarning, scheduleErrorWarning } = useToasts()
  const dispatch = useDispatch()
  const drivingLicense = useSelector(getMdlDisplayData)
  const goBack = useGoBack()
  const redirect = useRedirect()
  const { toDocument } = useInitDocuments()

  const initDrivingLicense = async () => {
    const mdlDisplayData = await sdk
      .getPersonalizationStatus()
      .then((isPersonalized) => {
        if (isPersonalized) return sdk.getDisplayData()
        return null
      })
    dispatch(setMdlDisplayData(mdlDisplayData))
  }

  const createDrivingLicenseVC = async (
    data: DrivingLicenseData,
  ): Promise<void> => {
    const filteredData = _.pick(data, [
      'given_name',
      'family_name',
      'birth_date',
      'document_number',
      'issuing_authority',
      'expiry_date',
      'issue_date',
      'issuing_country',
      'un_distinguishing_sign',
      'driving_privileges',
      'portrait',
    ])

    // TODO
    filteredData.driving_privileges = JSON.stringify(
      filteredData.driving_privileges,
    )
    filteredData.portrait = utf8ToBase64Image(filteredData.portrait)

    const did = agent.identityWallet.did

    const vc = await agent.credentials.create({
      metadata: mdlMetadata,
      subject: did,
      claim: filteredData,
    })

    await agent.credentials.types.create(
      makeMdlManifest(did) as CredentialMetadataSummary,
    )

    const mdlDocument = await toDocument(vc)
    dispatch(addCredentials([mdlDocument]))
  }

  const personalizeLicense = (
    qrString: string,
    onRequests: (requests: PersonalizationInputRequest[]) => void,
  ) => {
    sdk.startPersonalization(qrString)

    const requestHandler = (requests: string) => {
      const jsonRequests = JSON.parse(requests) as PersonalizationInputRequest[]

      onRequests(jsonRequests)
    }
    const successHandler = () => {
      unsubscribe()

      redirect(ScreenNames.Documents)
      sdk
        .getDisplayData()
        .then((displayData) => {
          createDrivingLicenseVC(displayData).catch(console.warn)
          dispatch(setMdlDisplayData(displayData))
          dispatch(dismissLoader())
        })
        .catch(console.warn)
    }
    const errorHandler = (error: string) => {
      unsubscribe()

      dispatch(dismissLoader())
      //FIXME currently returns null, but should return stringified DrivingLicenseError
      const jsonError = JSON.parse(error) as DrivingLicenseError
      scheduleErrorWarning(new Error(jsonError.name))
    }

    sdk.emitter.addListener(
      DrivingLicenseEvents.personalizationRequests,
      requestHandler,
    )
    sdk.emitter.addListener(
      DrivingLicenseEvents.personalizationSuccess,
      successHandler,
    )
    sdk.emitter.addListener(
      DrivingLicenseEvents.personalizationError,
      errorHandler,
    )

    const unsubscribe = () => {
      sdk.emitter.removeListener(
        DrivingLicenseEvents.personalizationRequests,
        requestHandler,
      )
      sdk.emitter.removeListener(
        DrivingLicenseEvents.personalizationRequests,
        successHandler,
      )
      sdk.emitter.removeListener(
        DrivingLicenseEvents.personalizationRequests,
        errorHandler,
      )
    }
  }

  const finishPersonalization = (responses: PersonalizationInputResponse[]) => {
    dispatch(
      setLoader({
        type: LoaderTypes.default,
        msg: 'Führerscheindaten hinzufügen',
      }),
    )
    return sdk.finishPersonalization(responses)
  }

  const deleteDrivingLicense = () => {
    return sdk
      .deleteDrivingLicense()
      .then(() => {
        dispatch(setMdlDisplayData(null))
      })
      .catch(scheduleErrorWarning)
  }

  const startSharing = async () => {
    const engagementHandler = (state: string) => {
      const jsonState = JSON.parse(state) as EngagementState

      switch (jsonState.name) {
        case EngagementStateNames.started:
          dispatch(
            setLoader({
              type: LoaderTypes.default,
              msg: 'Führerscheindaten werden übertragen…',
            }),
          )
          break
        case EngagementStateNames.ended:
          dispatch(
            setLoader({
              type: LoaderTypes.success,
              msg: 'Ihre Führerscheindaten wurden erfolgreich übermittelt!',
            }),
          )

          break
        case EngagementStateNames.canceled:
          dispatch(
            setLoader({
              type: LoaderTypes.error,
              msg: 'Die Datenübertragen wurde abgebrochen. Bitte versuchen Sie es erneut.',
            }),
          )
          break
        case EngagementStateNames.error:
          dispatch(
            setLoader({
              type: LoaderTypes.error,
              msg: `Die Datenübertragung war nicht erfolgreich!`,
            }),
          )
          break
        default:
          break
      }

      if (
        [
          EngagementStateNames.error,
          EngagementStateNames.canceled,
          EngagementStateNames.ended,
        ].includes(jsonState.name)
      ) {
        unsubscribe()
        setTimeout(() => {
          dispatch(dismissLoader())
          goBack()
        }, 2000)
      }
    }

    sdk.emitter.addListener(
      DrivingLicenseEvents.engagementState,
      engagementHandler,
    )
    const unsubscribe = () => {
      sdk.emitter.removeListener(
        DrivingLicenseEvents.engagementState,
        engagementHandler,
      )
    }

    return sdk.prepareDeviceEngagement()
  }

  return {
    drivingLicenseSDK: sdk,
    drivingLicense,
    personalizeLicense,
    deleteDrivingLicense,
    finishPersonalization,
    initDrivingLicense,
    startSharing,
  }
}
