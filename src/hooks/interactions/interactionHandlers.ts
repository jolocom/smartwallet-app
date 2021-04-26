import {
  AuthenticationFlowState,
  AuthorizationFlowState,
  CredentialOfferFlowState,
  CredentialRequestFlowState,
} from '@jolocom/sdk/js/interactionManager/types'

import { Agent, FlowType, Interaction } from 'react-native-jolocom'
import {
  getCredentialCategory,
  mapAttributesToDisplay,
  mapCredentialsToDisplay,
  separateCredentialsAndAttributes,
} from '../signedCredentials/utils'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { AttributeTypes } from '~/types/credentials'
import { CredentialIssuer } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { SWErrorCodes } from '~/errors/codes'

class CredentialRequestHandler {
  #requestedCredentials: SignedCredential[]
  #validatedCredentials: SignedCredential[]

  constructor(
    public interaction: Interaction,
    public credentials: CredentialIssuer,
  ) {
    this.#requestedCredentials = []
    this.#validatedCredentials = []
  }

  private get requestedCredentialTypes(): string[][] {
    const state = this.interaction.getSummary()
      .state as CredentialRequestFlowState
    const { constraints } = state
    const { requestedCredentialTypes } = constraints[0]
    return requestedCredentialTypes
  }

  private get requestedTypes(): string[] {
    return this.requestedCredentialTypes.map((t) => t[1])
  }

  async getStoredRequestedCredentials() {
    const typesQuery = this.requestedCredentialTypes.map((t) => ({ type: t }))
    // TODO: this returns not correct number of credentials
    // because first types of constraint and actual credential
    // do not match Credentials vs VerifiableCredential
    const requestedCredentials = await this.credentials.query(typesQuery)

    // TODO: remove after fixed issue with sdk credential query
    const correctRequestedCredentials = requestedCredentials.filter((c) => {
      if (this.requestedCredentialTypes.find((rt) => rt[1] === c.type[1])) {
        return true
      }
      return false
    })

    this.#requestedCredentials = correctRequestedCredentials
    return this
  }

  validateAgainstConstrains() {
    // FIX: this returns not correct number of credentials
    // because first types of constraint and actual credential
    // do not match Credentials vs VerifiableCredential
    // @ts-expect-error: correctRequestedCredentials do not match SignedCredential type
    this.#validatedCredentials = (this.interaction.getMessages()[0]
    .interactionToken as CredentialRequest).applyConstraints(
      // @ts-expect-error: correctRequestedCredentials do not match SignedCredential type
      this.#requestedCredentials,
    )

    return this
  }

  checkForMissingServiceIssuedCredentials() {
    const hasNoMissingServiceIssuedCredentials = this.requestedTypes.every(
      (t) => {
        if (Object.values(AttributeTypes).includes(t)) {
          // credential is a self issued credential
          return true
        } else {
          // credential is a service issued credential
          return Boolean(
            this.#validatedCredentials.find((c) => c.type[1] === t),
          )
        }
      },
    )

    if (!hasNoMissingServiceIssuedCredentials)
      throw new Error(SWErrorCodes.SWInteractionRequestMissingDocuments)
    return this
  }

  async prepareCredentialsForUI(did: string) {
    // TODO: there is a hook we can use useCredentials().separateSignedTransformToUI
    const {
      credentials: validatedServiceIssuedC,
      selfIssuedCredentials: validatedSelfIssuedC,
    } = separateCredentialsAndAttributes(this.#validatedCredentials, did)

    const displayCredentials = await Promise.all(
      validatedServiceIssuedC.map((c) =>
        mapCredentialsToDisplay(this.credentials, c),
      ),
    )
    return {
      credentials: displayCredentials,
      attributes: mapAttributesToDisplay(validatedSelfIssuedC),
      requestedTypes: this.requestedTypes,
      selectedCredentials: {},
    }
  }
}

const authenticationHandler = (state: AuthenticationFlowState) => ({
  description: state.description,
})

const authorizationHandler = (state: AuthorizationFlowState) => state

const credentialOfferHandler = (state: CredentialOfferFlowState) => {
  return {
    credentials: {
      service_issued: state.offerSummary.map(
        ({ renderInfo, type, credential }) => ({
          type: type,
          category: getCredentialCategory(renderInfo),
          invalid: false,
          name: credential?.name ?? '',
          properties: credential?.display?.properties || [],
        }),
      ),
    },
  }
}

/**
 * 1. Use it to check whatever logic should happen before
 * mapping interaction to the wallet UI structure
 * (process data, etc. for a given type of interaction)
 * before we dispatch interaction details into redux store
 * 2. Map interaction details to the wallet UI structure
 */
export const interactionHandler = async (
  agent: Agent,
  interaction: Interaction,
  did: string,
) => {
  const { state, initiator } = interaction.getSummary()

  let flowSpecificData

  switch (interaction.flow.type) {
    case FlowType.Authorization: {
      flowSpecificData = authorizationHandler(state as AuthenticationFlowState)
      break
    }
    case FlowType.Authentication: {
      flowSpecificData = authenticationHandler(state as AuthorizationFlowState)
      break
    }
    case FlowType.CredentialOffer: {
      flowSpecificData = credentialOfferHandler(
        state as CredentialOfferFlowState,
      )
      break
    }
    case FlowType.CredentialShare: {
      const handler = new CredentialRequestHandler(
        interaction,
        agent.credentials,
      )

      flowSpecificData = await (await handler.getStoredRequestedCredentials())
        .validateAgainstConstrains()
        .checkForMissingServiceIssuedCredentials() // this will throw
        .prepareCredentialsForUI(did)

      break
    }

    default:
      // TODO: Define error and use translations
      throw new Error('Interaction not supported')
  }

  return {
    counterparty: initiator,
    ...flowSpecificData,
  }
}
