import {
  InteractionDetails,
  AuthenticationDetailsI,
  AuthorizationDetailsI,
  CredOfferI,
  CredShareI,
} from './types'
import { FlowType } from 'react-native-jolocom'

export function isAuthDetails(ssi: any): ssi is AuthenticationDetailsI {
  return ssi.flowType === FlowType.Authentication
}
export function isAuthzDetails(ssi: any): ssi is AuthorizationDetailsI {
  return ssi.flowType === FlowType.Authorization
}

export function isCredOfferDetails(ssi: any): ssi is CredOfferI {
  return (
    ssi.flowType === FlowType.CredentialOffer &&
    !!ssi.credentials.service_issued &&
    !ssi.credentials.self_issued
  )
}

export function isCredShareDetails(ssi: any): ssi is CredShareI {
  return (
    ssi.flowType === FlowType.CredentialShare &&
    !!ssi.attributes &&
    !!ssi.credentials &&
    !!ssi.requestedTypes &&
    !!ssi.selectedCredentials
  )
}

export function isNotActiveInteraction(
  ssi: InteractionDetails,
): ssi is { flowType: null; id: null } {
  return ssi.flowType === null
}
