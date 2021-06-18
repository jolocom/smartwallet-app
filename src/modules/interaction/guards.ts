import {
  InteractionDetails,
  AuthenticationDetailsI,
  AuthorizationDetailsI,
  CredOfferI,
  CredShareI,
} from './types'
import { FlowType } from 'react-native-jolocom'

export function isAuthDetails(details: any): details is AuthenticationDetailsI {
  return details.flowType === FlowType.Authentication
}
export function isAuthzDetails(details: any): details is AuthorizationDetailsI {
  return (
    details.flowType === FlowType.Authorization
  )
}

export function isCredOfferDetails(details: any): details is CredOfferI {
  return (
    details.flowType === FlowType.CredentialOffer &&
    !!details.credentials.service_issued &&
    !details.credentials.self_issued
  )
}

export function isCredShareDetails(details: any): details is CredShareI {
  return (
    details.flowType === FlowType.CredentialShare &&
    !!details.attributes &&
    !!details.credentials &&
    !!details.requestedTypes &&
    !!details.selectedCredentials
  )
}

export function isNotActiveInteraction(
  details: InteractionDetails,
): details is { flowType: null; id: null } {
  return details.flowType === null
}
