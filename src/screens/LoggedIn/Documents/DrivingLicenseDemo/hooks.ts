import { useRef } from 'react'
import DrivingLicenseSDK, {
  DrivingLicenseError,
  DrivingLicenseEvents,
  EngagementState,
  EngagementStateNames,
  PersonalizationInputRequest,
  PersonalizationInputResponse
} from 'react-native-mdl'
import { useDispatch, useSelector } from 'react-redux'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { setMdlDisplayData } from '~/modules/mdl/actions'
import { getMdlDisplayData } from '~/modules/mdl/selectors'
import { ScreenNames } from '~/types/screens'

export const useDrivingLicense = () => {
  const sdk = useRef(new DrivingLicenseSDK()).current
  const { scheduleWarning, scheduleErrorWarning } = useToasts()
  const dispatch = useDispatch()
  const drivingLicense = useSelector(getMdlDisplayData)
  const goBack = useGoBack()
  const redirect = useRedirect()

  const initDrivingLicense = async () => {
    const initializedSdk = await sdk.init()
    const isPersonalized = await sdk.getPersonalizationStatus()
    if (isPersonalized) {
      console.log({isPersonalized})
      const displayData = await sdk.getDisplayData()
      dispatch(setMdlDisplayData(displayData))
    }
  }

  const personalizeLicense = (
    qrString: string,
    onRequests: (requests: PersonalizationInputRequest[]) => void,
  ) => {
    console.log('before startPersonalization')
    sdk.startPersonalization(qrString)
    console.log('after startPersonalization')

    const requestHandler = (request: string | PersonalizationInputRequest) => {
      // NOTE: this is a thing bc on ios we can't send objects through events, while
      // on android we can only send objects
      let jsonRequests: PersonalizationInputRequest[]
      if (typeof request === 'string') {
        jsonRequests = JSON.parse(request) as PersonalizationInputRequest[]
      } else {
        jsonRequests = [request]
      }

      console.log('REQUESTS: ', jsonRequests)
      onRequests(jsonRequests)
    }
    const successHandler = () => {
      console.log('SUCCESSFUL PERSONALIZATION')
      unsubscribe()

      redirect(ScreenNames.Documents)
      sdk
        .getDisplayData()
        .then((displayData) => {
          dispatch(setMdlDisplayData(displayData))
          dispatch(dismissLoader())
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
      console.log('PERSONALIZATION FAILED ', jsonError)
      scheduleErrorWarning(new Error(jsonError.name))
    }

    const logHandler = (data: any) => {
      console.log("LOG: ", data)
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
    sdk.emitter.addListener(
      "log",
      logHandler,
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
      sdk.emitter.removeListener(
	"log",
        logHandler,
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
