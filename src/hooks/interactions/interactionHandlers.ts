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
  sortCredentialsByRecentIssueDate,
} from '../signedCredentials/utils'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { AttributeTypes } from '~/types/credentials'
import { CredentialIssuer } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { SWErrorCodes } from '~/errors/codes'
import { useAgent } from '../sdk'
import useTranslation from '~/hooks/useTranslation'
import { useToasts } from '../toasts'
import { strings } from '~/translations'
import truncateDid from '~/utils/truncateDid'

class CredentialRequestHandler {
  #requestedCredentials: SignedCredential[]
  #validatedCredentials: SignedCredential[]
  public missingCredentialTypes: string[] = []

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

    this.#requestedCredentials = sortCredentialsByRecentIssueDate(
      correctRequestedCredentials,
    )
    return this
  }

  validateAgainstConstrains() {
    // FIX: this returns not correct number of credentials
    // because first types of constraint and actual credential
    // do not match Credentials vs VerifiableCredential

    this.#validatedCredentials = (
      this.interaction.getMessages()[0].interactionToken as CredentialRequest
    )
      .applyConstraints(this.#requestedCredentials.map((c) => c.toJSON()))
      .map((c) => SignedCredential.fromJSON(c))

    return this
  }

  checkForMissingServiceIssuedCredentials() {
    const missingServiceIssuedCredentials = this.requestedTypes.filter((t) => {
      if (Object.values(AttributeTypes).includes(t as AttributeTypes)) {
        // credential is a self issued credential
        return false
      } else {
        // credential is a service issued credential
        return Boolean(this.#validatedCredentials.find((c) => c.type[1] === t))
      }
    })

    if (!!missingServiceIssuedCredentials.length) {
      this.missingCredentialTypes = missingServiceIssuedCredentials
    }

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
export const useInteractionHandler = () => {
  const agent = useAgent()
  const { did } = agent.idw
  const { t } = useTranslation()
  const { scheduleWarning } = useToasts()

  return async (interaction: Interaction) => {
    const { state, initiator } = interaction.getSummary()
    const serviceName =
      initiator.publicProfile?.name ?? truncateDid(initiator.did)

    let flowSpecificData

    switch (interaction.flow.type) {
      case FlowType.Authorization: {
        flowSpecificData = authorizationHandler(
          state as AuthenticationFlowState,
        )
        break
      }
      case FlowType.Authentication: {
        flowSpecificData = authenticationHandler(
          state as AuthorizationFlowState,
        )
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
          .checkForMissingServiceIssuedCredentials()
          .prepareCredentialsForUI(did)

        if (!handler.missingCredentialTypes.length) {
          flowSpecificData = undefined
          // FIXME: there is an issue with the strings here, will be fixed when the
          // i18n and PoEditor are properly set up.
          scheduleWarning({
            title: t(strings.SHARE_MISSING_DOCS_TITLE),
            message: t(strings.SHARE_MISSING_DOCS_MSG, {
              serviceName,
              documentType: handler.missingCredentialTypes[0],
            }),
          })
        }

        break
      }

      default:
        // TODO: Define error and use translations
        throw new Error('Interaction not supported')
    }

    return flowSpecificData
  }
}
