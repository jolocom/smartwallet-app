import { useDispatch } from 'react-redux'

import { updateOfferValidation } from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { useToasts } from '../toasts'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import useInteractionToasts from './useInteractionToasts'
import { useRedirect } from '../navigation'
import { addCredentials } from '~/modules/credentials/actions'
import { useCredentials } from '../signedCredentials'
import { useFinishInteraction } from './handlers'
import { CredentialCategories } from '~/types/credentials'
import { SWErrorCodes } from '~/errors/codes'

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
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()
  const { scheduleInfo } = useToasts()
  const redirect = useRedirect()
  const finishInteraction = useFinishInteraction()
  const { signedCredentialToUI } = useCredentials()

  const scheduleSuccess = (initialTab: CredentialCategories) =>
    scheduleSuccessInteraction({
      interact: {
        label: strings.REVIEW,
        onInteract: () => redirect(ScreenNames.Documents, { initialTab }),
      },
    })

  const handleStoreIssuedCredentials = async () => {
    const issuedCredentials = await storeSelectedCredentials()
    const displayCredentials = await signedCredentialToUI(issuedCredentials)
    dispatch(addCredentials(displayCredentials))
  }

  const getInitialDocumentsTab = async () => {
    const validatedCredentials = await getValidatedCredentials()
    const allOther = validatedCredentials.every(
      (cred) => cred.category === CredentialCategories.other,
    )
    return allOther ? CredentialCategories.other : CredentialCategories.document
  }

  return async () => {
    try {
      if (await credentialsAlreadyIssued()) {
        await handleStoreIssuedCredentials()
        const initialTab = await getInitialDocumentsTab()
        scheduleSuccess(initialTab)
        return finishInteraction()
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
        await handleStoreIssuedCredentials()
        const initialTab = await getInitialDocumentsTab()
        scheduleSuccess(initialTab)
        finishInteraction()
      } else if (allInvalid) {
        //TODO: add translation interpolation to the toast message
        scheduleErrorInteraction(
          new Error(SWErrorCodes.SWInteractionOfferAllInvalid),
          {
            title: strings.OFFER_ALL_INVALID_TOAST_TITLE,
            message: strings.OFFER_ALL_INVALID_TOAST_MSG,
          },
        )
        finishInteraction()
      } else {
        dispatch(updateOfferValidation(validatedCredentials))
        scheduleInfo({
          title: strings.OFFER_RENEGOTIATION_TITLE,
          message: strings.OFFER_RENEGOTIATION_MSG,
        })
      }
    } catch (err) {
      scheduleErrorInteraction(err)
      console.log({ err })
      finishInteraction()
      throw new Error(err)
    }
  }
}

export default useCredentialOfferSubmit
