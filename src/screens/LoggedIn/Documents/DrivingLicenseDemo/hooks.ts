import { useEffect, useRef, useState } from 'react'
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
    const mdlDisplayData = await sdk
      .getPersonalizationStatus()
      .then((isPersonalized) => {
        if (isPersonalized) return sdk.getDisplayData()
        return null
      })
    dispatch(setMdlDisplayData(mdlDisplayData))
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
      sdk.getDisplayData().then((displayData) => {
        dispatch(setMdlDisplayData(displayData))
        dispatch(dismissLoader())
      })
    }
    const errorHandler = (error: string) => {
      unsubscribe()

      dispatch(dismissLoader())
      //FIXME currently returns null, but should return stringified DrivingLicenseError
      const jsonError = JSON.parse(error) as DrivingLicenseError
      scheduleWarning({
        title: 'Oops!',
        message: 'Something went wrong! Are you sure you sent the right data?',
      })
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
        msg: 'Personalizing Driving License',
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
              msg: 'Sharing the Driving License...',
            }),
          )
          break
        case EngagementStateNames.ended:
          dispatch(
            setLoader({
              type: LoaderTypes.success,
              msg: 'Success! Your driving license was successfully shared!',
            }),
          )

          break
        case EngagementStateNames.canceled:
          dispatch(
            setLoader({
              type: LoaderTypes.error,
              msg: 'Sharing was canceled! Please try again.',
            }),
          )
          break
        case EngagementStateNames.error:
          dispatch(
            setLoader({
              type: LoaderTypes.error,
              msg: `Failed to share! ${jsonState.error?.localizedDescription}`,
            }),
          )
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
