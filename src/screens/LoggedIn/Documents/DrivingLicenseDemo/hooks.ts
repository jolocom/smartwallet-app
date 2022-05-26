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
import { useGoBack } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { dismissLoader, setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { setMdlDisplayData } from '~/modules/mdl/actions'
import { getMdlDisplayData } from '~/modules/mdl/selectors'

export const useDrivingLicense = () => {
  const sdk = useRef(new DrivingLicenseSDK()).current
  const { scheduleWarning, scheduleErrorWarning } = useToasts()
  const dispatch = useDispatch()
  const drivingLicense = useSelector(getMdlDisplayData)
  const goBack = useGoBack()

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
    onRequests: (requests: PersonalizationInputRequest[]) => void,
  ) => {
    const requestHandler = (requests: string) => {
      const jsonRequests = JSON.parse(requests) as PersonalizationInputRequest[]

      onRequests(jsonRequests)
    }
    const successHandler = () => {
      unsubscribe()

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

    // TODO get this value from scanner
    sdk.startPersonalization(
      'iso23220-3-sed:g3NvcmcuaXNvLjIzMjIwLTMtMS4weQKYaEVPaEFTYWhHQ0ZaQVhJd2dnRnVNSUlCRmFBREFnRUNBZ1JpQ2hTL01Bb0dDQ3FHU000OUJBTUNNQzB4Q3pBSkJnTlZCQVlUQWtSRk1SNHdIQVlEVlFRRERCVmlaSElnYlVSTUlGUkZVMVFnY0hKdmRtTnZaR1V3SGhjTk1qSXdNakUwTURnek56RTVXaGNOTWpNd01qRTBNRGd6TnpFNVdqQXRNUXN3Q1FZRFZRUUdFd0pFUlRFZU1Cd0dBMVVFQXd3VlltUnlJRzFFVENCVVJWTlVJSEJ5YjNaamIyUmxNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUV3aUszSi95a0JOR3NCMmpEVlkvUHh6SlpWTU5pYzkrREVLWFpnM05YdFNUb1NoaWVDb2ZNVTRSU1lTaTZXT0hMSS9rWndVdkVkUk9xM2I3Q0hUc1FzcU1qTUNFd0VnWURWUjBsQkFzd0NRWUhLSUdNWFFVQkFqQUxCZ05WSFE4RUJBTUNCNEF3Q2dZSUtvWkl6ajBFQXdJRFJ3QXdSQUlnTWF0WE5MejZSOXNDQ04xZmpZWjBOeEpxTXR4Y2I4dThUM25ZL0t4YUMyWUNJRFEwV1JZRHR2UGpGOTBHYkNEMnZKS1ZDZUtBaHJ1M3MxajlhdE9WWVkzVFdESFlHRmd0b1dsSVlYTm9UV1JzU1dSWUlORmxmS3NxZ3ZnN0lQNk5uV0xmSEN4MGdyNnBGaGE5WjlVSGVWd2U4cG5RV0VBMkdWVWNFS3Npb3h4OUVOcVNZYmRvckpaN0I5OHByNzc5OEZKMHJmeEdlRWpzZ0xhMFJHOThYNFZURk91c0RNL0tLOHkzN2ZoN0xUcEYzaWZMdi84UHhFaHR0cHM6Ly9kZW1vLm1kbC5idW5kZXNkcnVja2VyZWkuZGUvYXBpL2RldmljZWRpc2NvdmVyYWJpbGl0eS9tZXNzYWdl',
    )
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
        setTimeout(() => {
          dispatch(dismissLoader())
          goBack()
        }, 2000)
      }

      console.log(JSON.stringify(jsonState, null, 2))
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
