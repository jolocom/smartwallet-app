import { useDispatch, useSelector } from 'react-redux'

import { updateOfferValidation } from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { useToasts } from '../toasts'
import { ScreenNames } from '~/types/screens'
import useInteractionToasts from './useInteractionToasts'
import { useRedirect } from '../navigation'
import { addCredentials } from '~/modules/credentials/actions'
import { useCredentials } from '../signedCredentials'
import { useFinishInteraction } from './handlers'
import { CredentialCategories } from '~/types/credentials'
import { SWErrorCodes } from '~/errors/codes'
import { useTranslation } from 'react-i18next'
import { getInteractionCounterpartyName } from '~/modules/interaction/selectors'

const useCredentialOfferSubmit = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const counterpartyName = useSelector(getInteractionCounterpartyName)
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  } = useCredentialOfferFlow()
  const { scheduleSuccessInteraction } = useInteractionToasts()
  const { scheduleInfo, scheduleErrorWarning } = useToasts()
  const redirect = useRedirect()
  const finishInteraction = useFinishInteraction()
  const { signedCredentialToUI } = useCredentials()

  const scheduleSuccess = (initialTab: CredentialCategories) =>
    scheduleSuccessInteraction({
      interact: {
        label: t('Toasts.successfulOfferInteractionBtn'),
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
        scheduleErrorWarning(
          new Error(SWErrorCodes.SWInteractionOfferAllInvalid),
          {
            title: t('Toasts.offerInvalidDocsTitle'),
            message: t('Toasts.offerInvalidDocsMsg', {
              serviceName: counterpartyName,
            }),
          },
        )
        finishInteraction()
      } else {
        dispatch(updateOfferValidation(validatedCredentials))
        scheduleInfo({
          title: t('Toasts.offerRenegotiationTitle'),
          message: t('Toasts.offerRenegotiationMsg'),
        })
      }
    } catch (err) {
      scheduleErrorWarning(err)
      console.log({ err })
      finishInteraction()
      throw new Error(err)
    }
  }
}

export default useCredentialOfferSubmit
