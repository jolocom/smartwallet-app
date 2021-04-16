import { AuthorizationFlow } from '@jolocom/sdk/js/interactionManager/authorizationFlow';
import { Flow } from '@jolocom/sdk/js/interactionManager/flow';
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest';
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest';
import {
  FlowType,
  Interaction,
} from 'react-native-jolocom'


const authenticationHandler = (interaction: Interaction<Flow<AuthorizationFlow>>) => {
  /**
   * Part 1:
   * Data mapping
   */

  return;
}

const authorizationHandler = (interaction: Interaction<Flow<AuthorizationFlow>>) => {
  /**
   * Part 1:
   * Data mapping
   */
  return;
}

/**
 * NOTE: for now only using type of request token `CredentialOfferRequest`
 */
const credentialOfferHandler = (interaction: Interaction<Flow<CredentialOfferRequest>>) => {
  /**
   * Part 1:
   * Data mapping (this is a place to take care of credential offer display)
   */
  return;
}

/**
 * NOTE: for now only using type of request token `CredentialRequest`
 */
const credentialShareHandler = (interaction: Interaction<Flow<CredentialRequest>>) => {
  /**
   * Part 1:
   * 1. Check if requested documents are available
   * 2. Apply constrains
   */
  /**
   * Part 2:
   * Data mapping
   */
  return;
}


/**
 * Use it to check whatever logic
 * (process data, etc. for a given type of interaction)
 * before we dispatch interaction details into redux store
 */
export const preHandler = {
  [FlowType.Authorization]: authorizationHandler,
  [FlowType.Authentication]: authenticationHandler,
  [FlowType.CredentialOffer]: credentialOfferHandler,
  [FlowType.CredentialShare]: credentialShareHandler,
}

