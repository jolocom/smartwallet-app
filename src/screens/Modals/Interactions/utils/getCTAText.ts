import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { strings } from '~/translations/strings'

export default function getCTAText(flowType: FlowType) {
  switch (flowType) {
    case FlowType.Authentication:
      return strings.AUTHENTICATE
    case FlowType.CredentialShare:
      return strings.SHARE
    case FlowType.CredentialReceive:
      return strings.RECEIVE
    default:
      return ''
  }
}
