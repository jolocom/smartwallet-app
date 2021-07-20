import { CredentialIssuer } from "@jolocom/sdk/js/credentials"
import { CredentialRequestFlowState } from "@jolocom/sdk/js/interactionManager/types"
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential"
import { CredentialRequest } from "jolocom-lib/js/interactionTokens/credentialRequest"
import { Interaction } from "react-native-jolocom"
import { mapAttributesToDisplay, mapCredentialsToDisplay, separateCredentialsAndAttributes, sortCredentialsByRecentIssueDate } from "~/hooks/signedCredentials/utils"
import { AttributeTypes } from "~/types/credentials"

export class CredentialRequestHandler {
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
        /**
         * credential is a self issued credential -> exclude it
         */
        return false
      } else {
        /**
         * credential is a service issued credential -> check its presence in validated credentials
         */
        return !Boolean(this.#validatedCredentials.find((c) => c.type[1] === t))
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
