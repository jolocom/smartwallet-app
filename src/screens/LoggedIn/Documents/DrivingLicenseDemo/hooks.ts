import _ from 'lodash'
import { useRef } from 'react'
//@ts-expect-error
import { Platform } from 'react-native'
import { BluetoothStatus } from 'react-native-bluetooth-status'
import DeviceInfo from 'react-native-device-info'
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
import Permissions, {
  PERMISSIONS,
  PermissionStatus,
} from 'react-native-permissions'
import { useDispatch } from 'react-redux'
import { useDocuments, useInitDocuments } from '~/hooks/documents'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import { useAgent } from '~/hooks/sdk'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { addCredentials } from '~/modules/credentials/actions'
import { setMdoc } from '~/modules/interaction/mdl/actions'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { ScreenNames } from '~/types/screens'
import { makeMdlManifest, mdlMetadata, MDL_CREDENTIAL_TYPE } from './data'
import { utf8ToBase64Image } from './utils'

export const useDrivingLicense = () => {
  const { t } = useTranslation()
  const agent = useAgent()
  const sdk = useRef(new DrivingLicenseSDK()).current
  const {
    scheduleErrorWarning,
    scheduleWarning,
    scheduleSuccess,
    scheduleInfo,
  } = useToasts()
  const dispatch = useDispatch()
  const goBack = useGoBack()
  const redirect = useRedirect()
  const { toDocument } = useInitDocuments()
  const { getDocumentByType } = useDocuments()

  const initDrivingLicense = async () => {
    await sdk.init(
      t('mdl.authenticationTitle'),
      t('mdl.authenticationSubtitle'),
    )
  }

  const getDrivingLicense = () => {
    return getDocumentByType(MDL_CREDENTIAL_TYPE)
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

    filteredData.birth_date = moment(filteredData.birth_date).format(
      'DD.MM.YYYY',
    )
    filteredData.expiry_date = moment(filteredData.expiry_date).format(
      'DD.MM.YYYY',
    )
    filteredData.issue_date = moment(filteredData.issue_date).format(
      'DD.MM.YYYY',
    )
    const stringifiedDrivingPrivileges = JSON.stringify(
      filteredData.driving_privileges,
    )

    const stringifiedPortrait = utf8ToBase64Image(filteredData.portrait)

    const did = agent.identityWallet.did

    const vc = await agent.credentials.create({
      metadata: mdlMetadata,
      subject: did,
      claim: {
        ...filteredData,
        driving_privileges: stringifiedDrivingPrivileges,
        portrait: stringifiedPortrait,
      },
    })

    await agent.credentials.types.create(
      makeMdlManifest(did) as CredentialMetadataSummary,
    )

    const mdlDocument = await toDocument(vc)
    dispatch(addCredentials([mdlDocument]))
  }

  const logHandler = (data: Record<string, string>) => {
    console.log('MDL-LOG: ', data)
  }

  const personalizeLicense = (
    qrString: string,
    onRequests: (requests: PersonalizationInputRequest[]) => void,
  ) => {
    const existindMdlDocument = getDrivingLicense()

    if (existindMdlDocument) {
      return scheduleInfo({
        title: t('mdl.existingDocumentTitle'),
        message: t('mdl.existingDocumentDescription'),
        interact: {
          label: t('mdl.existingDocumentBtn'),
          onInteract: () => {
            redirect(ScreenNames.Documents)
          },
        },
      })
    }

    sdk.startPersonalization(qrString)

    const requestHandler = (request: string | PersonalizationInputRequest) => {
      // NOTE: this is a thing bc on ios we can't send objects through events, while
      // on android we can only send objects
      let jsonRequests: PersonalizationInputRequest[]
      if (typeof request === 'string') {
        jsonRequests = JSON.parse(request) as PersonalizationInputRequest[]
      } else {
        jsonRequests = [request]
      }

      onRequests(jsonRequests)
    }
    const successHandler = () => {
      unsubscribe()

      sdk
        .getDisplayData()
        .then((displayData) => {
          createDrivingLicenseVC(displayData).catch(scheduleErrorWarning)
          dispatch(dismissLoader())
          redirect(ScreenNames.Documents)
        })
        .catch(console.warn)
    }
    const errorHandler = (error: string | DrivingLicenseError) => {
      unsubscribe()

      dispatch(dismissLoader())
      let jsonError: DrivingLicenseError
      //FIXME currently returns null, but should return stringified DrivingLicenseError
      if (typeof error === 'string') {
        jsonError = JSON.parse(error) as DrivingLicenseError
      } else {
        jsonError = error
      }
      jsonError?.name
        ? scheduleErrorWarning(new Error(jsonError.name))
        : scheduleErrorWarning(new Error('Error personalizing mdl'))
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
    sdk.emitter.addListener(DrivingLicenseEvents.log, logHandler)

    const unsubscribe = () => {
      sdk.emitter.removeListener(
        DrivingLicenseEvents.personalizationRequests,
        requestHandler,
      )
      sdk.emitter.removeListener(
        DrivingLicenseEvents.personalizationSuccess,
        successHandler,
      )
      sdk.emitter.removeListener(
        DrivingLicenseEvents.personalizationError,
        errorHandler,
      )
      sdk.emitter.removeListener(DrivingLicenseEvents.log, logHandler)
    }
  }

  const finishPersonalization = (responses: PersonalizationInputResponse[]) => {
    dispatch(setMdoc(null))
    dispatch(
      setLoader({
        type: LoaderTypes.default,
        msg: t('mdl.personalizationLoader'),
      }),
    )
    return sdk.finishPersonalization(responses)
  }

  const deleteDrivingLicense = () => {
    return sdk.deleteDrivingLicense().catch(scheduleErrorWarning)
  }

  const shareDrivingLicense = async () => {
    BluetoothStatus.state().then((isEnabled: boolean) => {
      if (isEnabled) {
        checkBluetoothPermissions().then((status) => {
          if (Object.values(status).some((st) => st !== 'granted')) {
            scheduleErrorWarning(
              new Error('Bluetooth permissions not granted: ' + status),
            )
          } else {
            redirect(ScreenNames.DrivingLicenseShare)
          }
        })
      } else {
        scheduleWarning({
          title: t('mdl.bluetoothWarningTitle'),
          message: t('mdl.bluetoothWarningMessage'),
          interact: {
            label: t('mdl.bluetoothWarningBtn'),
            onInteract: () => {
              Permissions.openSettings()
            },
          },
        })
      }
    })
  }

  const prepareEngagementEvents = () => {
    const engagementHandler = (state: string | EngagementState) => {
      const jsonState =
        typeof state === 'string'
          ? (JSON.parse(state) as EngagementState)
          : state

      switch (jsonState.name) {
        case EngagementStateNames.started:
          dispatch(
            setLoader({
              type: LoaderTypes.default,
              msg: t('mdl.sharingLoader'),
            }),
          )
          break
        case EngagementStateNames.ended:
          scheduleSuccess({
            title: t('Toasts.ausweisSuccessTitle'),
            message: t('mdl.successToastMsg'),
          })

          break
        case EngagementStateNames.canceled:
          dispatch(
            setLoader({
              type: LoaderTypes.error,
              msg: t('mdl.canceledLoader'),
            }),
          )
          break
        case EngagementStateNames.error:
          scheduleErrorWarning(
            new Error(
              jsonState?.error?.localizedDescription ?? 'Unknown mDL Error',
            ),
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
    sdk.emitter.addListener(DrivingLicenseEvents.log, logHandler)
    const unsubscribe = () => {
      sdk.emitter.removeListener(
        DrivingLicenseEvents.engagementState,
        engagementHandler,
      )
      sdk.emitter.removeListener(DrivingLicenseEvents.log, logHandler)
    }
  }

  const prepareDeviceEngagement = async () => {
    return sdk.prepareDeviceEngagement()
  }

  const checkBluetoothPermissions = async (): Promise<
    Record<string, PermissionStatus>
  > => {
    const apiLevel = await DeviceInfo.getApiLevel()
    const isAndroid = Platform.OS === 'android'

    if (isAndroid && apiLevel >= 31) {
      return Permissions.requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ])
    }

    return Promise.resolve({ all: 'granted' })
  }

  return {
    drivingLicenseSDK: sdk,
    personalizeLicense,
    deleteDrivingLicense,
    finishPersonalization,
    initDrivingLicense,
    shareDrivingLicense,
    prepareDeviceEngagement,
    prepareEngagementEvents,
    getDrivingLicense,
  }
}
