import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'
import {
  SignedCredentialWithMetadata,
  CredentialOfferFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { JSONWebToken } from '@jolocom/sdk'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { IStorage } from '@jolocom/sdk/js/src/lib/storage'

const getResTokenAndProcess = async (
  interaction: Interaction,
  selectedCred: SignedCredentialWithMetadata[],
) => {
  // prepare the responseToken to be send to a service
  const responseToken = await interaction.createCredentialOfferResponseToken(
    selectedCred,
  )
  await interaction.processInteractionToken(responseToken)
  return responseToken
}

const getReceiveTokenAndProcess = async (
  interaction: Interaction,
  responseToken: JSONWebToken<any>,
) => {
  // prepare the receive token. Token will containing signed credentials
  const receiveToken = await interaction.send(responseToken)
  if (receiveToken) {
    await interaction.processInteractionToken(receiveToken)
    return receiveToken
  } else {
    throw new Error('Did not receive a token from a service')
  }
}

export const proceedWithTokensCommunication = async (
  interaction: Interaction,
  selectedCred: SignedCredentialWithMetadata[],
) => {
  const responseToken = await getResTokenAndProcess(interaction, selectedCred)
  await getReceiveTokenAndProcess(interaction, responseToken)
}

// this will check for duplicates and invalid credentials and return type of cred mapped to FE
export const verifyAndGetUpdatedCredentials = async (
  interaction: Interaction,
) => {
  const state: CredentialOfferFlowState = interaction.getSummary().state

  return Promise.all(
    state.offerSummary.map(async (offeredCred, idx: number) => {
      let storedSignedCred
      const updatedCred = { ...offeredCred }
      const signedCred = state.issued.find(
        (cred: SignedCredential) => cred.type[1] === offeredCred.type,
      )
      if (signedCred && signedCred.id) {
        storedSignedCred = await interaction.getStoredCredentialById(
          signedCred.id,
        )
      }

      if (
        (storedSignedCred && storedSignedCred.length) ||
        !state.credentialsValidity[idx]
      ) {
        updatedCred.invalid = true
      } else {
        updatedCred.invalid = false
      }
      return updatedCred
    }),
  )
}

export const storeCredentials = async (
  interaction: Interaction,
  storageLib: IStorage,
) => {
  const summary = interaction.getSummary()
  const { state, initiator } = summary

  await interaction.storeCredential(state.offerSummary)

  Promise.all(
    state.offerSummary.map(async (cred) => {
      const composedCred = { ...cred, issuer: initiator }
      await storageLib.store.credentialMetadata(composedCred)
    }),
  )
}
