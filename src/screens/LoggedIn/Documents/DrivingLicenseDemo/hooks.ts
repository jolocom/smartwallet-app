import { useEffect, useRef, useState } from "react"
import DrivingLicenseSDK, { DrivingLicenseData, DrivingLicenseError, DrivingLicenseEvents, PersonalizationInputRequest, PersonalizationInputResponse } from "react-native-mdl"
import { useDispatch, useSelector } from "react-redux"
import { useToasts } from "~/hooks/toasts"
import { dismissLoader, setLoader } from "~/modules/loader/actions"
import { LoaderTypes } from "~/modules/loader/types"
import { setMdlDisplayData } from "~/modules/mdl/actions"
import { getMdlDisplayData } from "~/modules/mdl/selectors"

export const useDrivingLicense = () => {
    const sdk = useRef(new DrivingLicenseSDK()).current
    const {scheduleWarning, scheduleErrorWarning} = useToasts()
    const dispatch = useDispatch()
    const drivingLicense = useSelector(getMdlDisplayData)

    const initDrivingLicense = async () => {
      const mdlDisplayData = await sdk.getPersonalizationStatus().then(isPersonalized => {
        if(isPersonalized) return sdk.getDisplayData()
        return null
      })
      console.log(JSON.stringify(mdlDisplayData, null, 2))
      dispatch(setMdlDisplayData(mdlDisplayData))
    }

    const personalizeLicense = (onRequests: (requests: PersonalizationInputRequest[]) => void) => {
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
            scheduleWarning({title: "Oops!", message: "Something went wrong! Are you sure you sent the right data?"})
        }
        
        sdk.emitter.addListener(DrivingLicenseEvents.personalizationRequests, requestHandler)
        sdk.emitter.addListener(DrivingLicenseEvents.personalizationSuccess, successHandler)
        sdk.emitter.addListener(DrivingLicenseEvents.personalizationError, errorHandler)

        const unsubscribe = () => {
            sdk.emitter.removeListener(DrivingLicenseEvents.personalizationRequests, requestHandler)
            sdk.emitter.removeListener(DrivingLicenseEvents.personalizationRequests, successHandler)
            sdk.emitter.removeListener(DrivingLicenseEvents.personalizationRequests, errorHandler)
        }

        sdk.startPersonalization("D120044IN61")
    }

    const finishPersonalization = (responses: PersonalizationInputResponse[]) => {
        dispatch(setLoader({type: LoaderTypes.default, msg: "Personalizing Driving License"}))
        return sdk.finishPersonalization(responses)
    }

    const deleteDrivingLicense = () => {
        return sdk.deleteDrivingLicense().then(() => {
            dispatch(setMdlDisplayData(null))
        }).catch(scheduleErrorWarning)
    }

    const startSharing = async () => {
        return sdk.prepareDeviceEngagement()
    }

    return { drivingLicenseSDK: sdk, drivingLicense, personalizeLicense, deleteDrivingLicense, finishPersonalization, initDrivingLicense, startSharing }
}