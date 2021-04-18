import { AuthenticationFlowState, AuthorizationFlowState, CredentialOfferFlowState, CredentialRequestFlowState } from '@jolocom/sdk/js/interactionManager/types'

import {
  FlowType,
  Interaction,
} from 'react-native-jolocom'
import { getCredentialCategory } from '../signedCredentials/utils';


const authenticationHandler = (state: AuthenticationFlowState) => ({description: state.description})

const authorizationHandler = (state: AuthorizationFlowState) => state;

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
  /**
   * Part 1:
   * Data mapping (this is a place to take care of credential offer display)
   */
  return;
}

const credentialShareHandler = (state: CredentialRequestFlowState) => {
  console.log('handling share');
  /**
   * Part 1:
   * 1. Check if requested documents are available
   * 2. Apply constrains
   */

  /**
   * 1.1
   */

  /**
   * Part 2:
   * Data mapping
   */
  return;
}


/**
 * 1. Use it to check whatever logic should happen before
 * mapping interaction to the wallet UI structure
 * (process data, etc. for a given type of interaction)
 * before we dispatch interaction details into redux store
 * 2. Map interaction details to the wallet UI structure
 */
export const interactionHandler = (interaction: Interaction) => {
  const {state, initiator} = interaction.getSummary();

  let flowSpecificData;
  
  switch(interaction.flow.type) {
    case FlowType.Authorization: {
      flowSpecificData = authorizationHandler(state as AuthenticationFlowState);
      break;
    }
    case FlowType.Authentication: {
      flowSpecificData = authenticationHandler(state as AuthorizationFlowState);
      break;
    }
    case FlowType.CredentialOffer: {
      flowSpecificData = credentialOfferHandler(state as CredentialOfferFlowState);
      break;
    }
    case FlowType.CredentialShare:
      // TODO: define handler
      throw new Error('No handler is written yet for credential request')
    default:
      // TODO: Define error and use translations
      throw new Error('Interaction not supported')
  }

  return {
    counterparty: initiator,
    ...flowSpecificData
  }
}

