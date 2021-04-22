import { AuthenticationFlowState, AuthorizationFlowState, CredentialOfferFlowState, CredentialRequestFlowState } from '@jolocom/sdk/js/interactionManager/types'

import {
  Agent,
  FlowType,
  Interaction,
} from 'react-native-jolocom'
import { getCredentialCategory, mapAttributesToDisplay, mapCredentialsToDisplay, separateCredentialsAndAttributes } from '../signedCredentials/utils';
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest';
import { AttributeTypes } from '~/types/credentials';


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
export const interactionHandler = async (agent: Agent, interaction: Interaction, did: string) => {
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
    case FlowType.CredentialShare: {
      const requestState = state as CredentialRequestFlowState;
      const {constraints} = requestState;

      // TODO: we should use of all constraints, i guess - constrains -> credentialrequest token
      const {requestedCredentialTypes} = constraints[0];
      const requestedTypes = requestedCredentialTypes.map(t => t[1]);
      
      const types = requestedCredentialTypes.map(t => ({type: t}))
      
      // TODO: this returns not correct number of credentials
      // because first types of constraint and actual credential
      // do not match Credentials vs VerifiableCredential
      const requestedCredentials = await agent.credentials.query(types)

      // TODO: remove after fixed issue with sdk credential query
      const correctRequestedCredentials = requestedCredentials.filter(c => {
        if(requestedCredentialTypes.find(rt => rt[1] === c.type[1])) {
          return true;
        }
        return false;
      })

      // TODO: decide how to present missing attribute      

      // FIX: this returns not correct number of credentials
      // because first types of constraint and actual credential
      // do not match Credentials vs VerifiableCredential
      // @ts-expect-error: correctRequestedCredentials do not match SignedCredential type
      const validatedCredentials = (interaction.getMessages()[0].interactionToken as CredentialRequest).applyConstraints(correctRequestedCredentials);
      
      const hasNoMissingServiceIssuedCredentials = requestedTypes.every(t => {
        if(Object.values(AttributeTypes).includes(t)) {
          // credential is a self issued credential
          return true
        } else {
          // credential is a service issued credential
          return Boolean(validatedCredentials.find(c => c.type[1] === t))
        }
      })

      if(!hasNoMissingServiceIssuedCredentials) throw new Error('Requested service issued credentials are missing')

      // TODO: there is a hook we can use useCredentials().separateSignedTransformToUI
      const {
        credentials: validatedServiceIssuedC,
        selfIssuedCredentials: validatedSelfIssuedC,
      // @ts-expect-error: validatedCredentials do not match SignedCredential type
      } = separateCredentialsAndAttributes(validatedCredentials, did);
      
      // TODO: if Self Issued Credentials are missing assign to [] 

      const displayCredentials = await Promise.all(validatedServiceIssuedC.map(c => mapCredentialsToDisplay(agent, c)));
      flowSpecificData = {
        credentials: displayCredentials,
        attributes: mapAttributesToDisplay(validatedSelfIssuedC),
        //TODO: rename to requested types
        requestedCredentials: requestedCredentialTypes.map(t => t[1]),
        selectedCredentials: {}
      }
      // throw new Error('WIP for credential request')
      break;
    }
      
    default:
      // TODO: Define error and use translations
      throw new Error('Interaction not supported')
  }

  return {
    counterparty: initiator,
    ...flowSpecificData
  }
}

