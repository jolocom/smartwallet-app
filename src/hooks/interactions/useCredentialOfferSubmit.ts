import { useDispatch } from 'react-redux'

import { updateOfferValidation } from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { ScreenNames } from '~/types/screens'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useRedirect } from '../navigation'
import { addCredentials } from '~/modules/credentials/actions'
import { useCredentials } from '../signedCredentials'
import { CredentialCategories } from '~/types/credentials'
import { SWErrorCodes } from '~/errors/codes'
import useTranslation from '~/hooks/useTranslation'
import { useToasts } from '../toasts'

const useCredentialOfferSubmit = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  } = useCredentialOfferFlow()
  const redirect = useRedirect()
  const { scheduleInfo } = useToasts()

  const { completeInteraction } = useCompleteInteraction(async () => {
    if (await credentialsAlreadyIssued()) {
      await handleStoreIssuedCredentials()
      const initialTab = await getInitialDocumentsTab()
      return scheduleSuccess(initialTab)
    }

    await assembleOfferResponseToken()
    await processOfferReceiveToken()

    // NOTE: Uncomment the line below to test the duplicates edge-case
    // await storeSelectedCredentials()
    const anyDuplicates = await checkDuplicates()
    if (anyDuplicates) {
      return {
        successToast: {
          title: t('Toasts.offerDuplicateTitle'),
          message: t('Toasts.offerDuplicateSingleMsg'),
        },
      }
    }

    const validatedCredentials = await getValidatedCredentials()
    const allValid = validatedCredentials.every((cred) => !cred.invalid)
    const allInvalid = validatedCredentials.every((cred) => cred.invalid)

    if (allValid) {
      await handleStoreIssuedCredentials()
      const initialtab = await getInitialDocumentsTab()
      return scheduleSuccess(initialtab)
    } else if (allInvalid) {
      throw new Error(SWErrorCodes.SWInteractionOfferAllInvalid)
    } else {
      dispatch(updateOfferValidation(validatedCredentials))

      /**
       * Pausing an interaction complete flow, becuase user should stay on the same screen and see the toast
       */
      return {
        pauseHandler: () =>
          scheduleInfo({
            title: t('Toasts.offerRenegotiationTitle'),
            message: t('Toasts.offerRenegotiationMsg'),
          }),
        pause: true,
      }
    }
  })
  const { signedCredentialToUI } = useCredentials()

  // util TODO: rename
  const scheduleSuccess = (initialTab: CredentialCategories) => ({
    successToast: {
      interact: {
        label: t('Toasts.successfulOfferInteractionBtn'),
        onInteract: () => redirect(ScreenNames.Documents, { initialTab }),
      },
    },
  })

  //util
  const handleStoreIssuedCredentials = async () => {
    const issuedCredentials = await storeSelectedCredentials()
    const displayCredentials = await signedCredentialToUI(issuedCredentials)
    dispatch(addCredentials(displayCredentials))
  }

  // util
  const getInitialDocumentsTab = async () => {
    const validatedCredentials = await getValidatedCredentials()
    const allOther = validatedCredentials.every(
      (cred) => cred.category === CredentialCategories.other,
    )
    return allOther ? CredentialCategories.other : CredentialCategories.document
  }

  return completeInteraction
}

export default useCredentialOfferSubmit
