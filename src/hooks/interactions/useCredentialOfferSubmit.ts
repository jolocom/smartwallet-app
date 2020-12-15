import { useDispatch } from 'react-redux'

import {
  resetInteraction,
  updateOfferValidation,
} from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { useSyncStorageCredentials } from '~/hooks/credentials'
import { useToasts } from '../toasts'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import useInteractionToasts from './useInteractionToasts'
import { useOutsideRedirect } from '~/NavigationProvider'

const useCredentialOfferSubmit = () => {
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  } = useCredentialOfferFlow()
  const syncCredentials = useSyncStorageCredentials()
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()
  const { scheduleInfo } = useToasts()
  const redirect = useOutsideRedirect()

  const scheduleSuccess = () =>
    scheduleSuccessInteraction({
      interact: {
        label: strings.REVIEW,
        onInteract: () => redirect(ScreenNames.Documents),
      },
    })

  return async () => {
    try {
      if (await credentialsAlreadyIssued()) {
        await storeSelectedCredentials()
        await syncCredentials()
        scheduleSuccess()
        return dispatch(resetInteraction())
      }

      await assembleOfferResponseToken()
      await processOfferReceiveToken()

      // NOTE: Uncomment the line below to test the duplicates edge-case
      // await storeSelectedCredentials()
      const anyDuplicates = await checkDuplicates()
      if (anyDuplicates)
        throw new Error(
          "Duplicates were found. Can't proceed with the interaction",
        )

      const validatedCredentials = await getValidatedCredentials()
      const allValid = validatedCredentials.every((cred) => !cred.invalid)
      const allInvalid = validatedCredentials.every((cred) => cred.invalid)

      if (allValid) {
        await storeSelectedCredentials()
        await syncCredentials()
        scheduleSuccess()
        dispatch(resetInteraction())
      } else if (allInvalid) {
        //TODO: add translation interpolation to the toast message
        scheduleErrorInteraction({
          title: strings.OFFER_ALL_INVALID_TOAST_TITLE,
          message: strings.OFFER_ALL_INVALID_TOAST_MSG,
        })

        dispatch(resetInteraction())
      } else {
        dispatch(updateOfferValidation(validatedCredentials))
        scheduleInfo({
          title: strings.OFFER_RENEGOTIATION_TITLE,
          message: strings.OFFER_RENEGOTIATION_MSG,
        })
      }
    } catch (err) {
      scheduleErrorInteraction()
      console.log({ err })
      dispatch(resetInteraction())
      throw new Error(err)
    }
  }
}

export default useCredentialOfferSubmit
