import {
  FlowType,
  InteractionSummary,
  CredentialRequestFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { AuthorizationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/authorizationFlow'

//NOTE: Temporary
const attr = [
  'ProofOfEmailCredential',
  'ProofOfMobilePhoneNumberCredential',
  'ProofOfNameCredential',
]

const mappedAttr: { [x: string]: string } = {
  ProofOfEmailCredential: 'email',
  ProofOfMobilePhoneNumberCredential: 'phone',
  ProofOfNameCredential: 'name',
}

const isSingleAttributeRequest = (constraints: CredentialRequest) => {
  const requestedTypes = constraints.requestedCredentialTypes[0]

  const isSingleRequest = requestedTypes.length === 1
  const isAttribute = attr.includes(requestedTypes[0])

  return isSingleRequest && isAttribute
}

const getTitleText = (flowType: FlowType | null) => {
  const { state, initiator }: InteractionSummary = useSelector(
    getInteractionSummary,
  )

  //TODO: @clauss add strings
  switch (flowType) {
    case FlowType.Authentication:
      return 'Is it really you?'

    case FlowType.CredentialShare:
      const initiatorName = initiator.publicProfile?.name
      const { constraints } = state as CredentialRequestFlowState
      const firstType = constraints[0].requestedCredentialTypes[0][0]
      return isSingleAttributeRequest(constraints[0])
        ? `${initiatorName ? initiatorName : 'Service'} requests ${
            mappedAttr[firstType]
          }`
        : 'Incoming request'

    case FlowType.CredentialReceive:
      return 'Incoming offer'

    case FlowType.Authorization:
      const { action } = state as AuthorizationFlowState
      return `Would you like to ${action}`

    default:
      return 'Incoming interaction'
  }
}

export default getTitleText
