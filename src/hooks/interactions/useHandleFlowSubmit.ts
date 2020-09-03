import { useSelector, useDispatch } from 'react-redux'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import {
  getInteractionType,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import useCredentialOfferFlow from '~/hooks/interactions/useCredentialOfferFlow'
import { Alert } from 'react-native'
import { useSyncCredentials } from '../credentials'
import { useInteraction } from '../sdk'

export const useHandleFlowSubmit = (): (() => Promise<any>) => {
  const interactionType = useSelector(getInteractionType)
  const dispatch = useDispatch()
  const {
    assembleOfferResponseToken,
    processOfferReceiveToken,
    getValidatedCredentials,
    storeSelectedCredentials,
    credentialsAlreadyIssued,
    checkDuplicates,
  } = useCredentialOfferFlow()
  const interaction = useInteraction()
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
  const syncCredentials = useSyncCredentials()

  if (interactionType === FlowType.Authentication) {
    return async function authenticate() {
      // TODO: add onAuthenticate functionality here
    }
  } else if (interactionType === FlowType.Authorization) {
    return async function authorize() {
      // TODO: add onAuthorization functionality here
    }
  } else if (interactionType === FlowType.CredentialShare) {
    return async () => {
      const mappedSelection = Object.values(selectedShareCredentials).map(
        (id) => ({
          id,
        }),
      )
      const response = await interaction.createCredentialResponse(
        // @ts-ignore is fixed in future SDK version. Should work this way, since we only need the @id
        mappedSelection,
      )
      await interaction.processInteractionToken(response)
      await interaction.send(response)
      Alert.alert('Credentials shared successfully')
      dispatch(resetInteraction())
    }
  } else if (interactionType === FlowType.CredentialOffer) {
    return async () => {
      try {
        if (credentialsAlreadyIssued()) {
          await storeSelectedCredentials()
          await syncCredentials()
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

        const validatedCredentials = getValidatedCredentials()
        const allValid = validatedCredentials.every((cred) => !cred.invalid)
        const allInvalid = validatedCredentials.every((cred) => cred.invalid)

        if (allValid) {
          await storeSelectedCredentials()
          await syncCredentials()
          Alert.alert('Documents stored successfully')
          //TODO: update store credentials with the new ones

          dispatch(resetInteraction())
        } else if (allInvalid) {
          Alert.alert('All the documents are corrupted')
          //TODO: dispatch "interaction failed" notification

          dispatch(resetInteraction())
        } else {
          //TODO: dispatch renegotiation notification

          const credentials = {
            service_issued: validatedCredentials,
          }
          dispatch(setInteractionDetails({ credentials }))
          Alert.alert('Renegotiating')
        }
      } catch (err) {
        //TODO: dispatch error notification
        Alert.alert('Interaction failed', err.message)

        console.log({ err })
        dispatch(resetInteraction())
        throw new Error(err)
      }
    }
  } else {
    throw new Error('Interaction Type not found')
  }
}
