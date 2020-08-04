import {
  FlowType,
  InteractionSummary,
  CredentialRequestFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import {
  getInteractionSummary,
  getIntermediaryState,
  getAttributeInputKey,
  getInteractionType,
} from '~/modules/interaction/selectors'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { AuthorizationFlowState } from '@jolocom/sdk/js/src/lib/interactionManager/authorizationFlow'
import { IntermediaryState } from '~/modules/interaction/types'
import { strings } from '~/translations/strings'

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

const useInteractionTitle = () => {
  const { state, initiator }: InteractionSummary = useSelector(
    getInteractionSummary,
  )
  const intermediaryState = useSelector(getIntermediaryState)
  const inputType = useSelector(getAttributeInputKey)
  const interactionType: FlowType | null = useSelector(getInteractionType)

  if (intermediaryState === IntermediaryState.showing)
    return strings.SAVE_YOUR_ATTRIBUTE(inputType)

  //TODO: @clauss add strings
  switch (interactionType) {
    case FlowType.Authentication:
      return strings.IS_IT_REALLY_YOU

    case FlowType.CredentialShare:
      const initiatorName = initiator.publicProfile?.name
      const { constraints } = state as CredentialRequestFlowState
      const firstType = constraints[0].requestedCredentialTypes[0][0]
      return isSingleAttributeRequest(constraints[0])
        ? strings.SERVICE_REQUESTS_ATTRIBUTE(
            initiatorName ? initiatorName : strings.SERVICE,
            mappedAttr[firstType],
          )
        : strings.INCOMING_REQUEST

    case FlowType.CredentialReceive:
      return strings.INCOMING_OFFER

    case FlowType.Authorization:
      const { action } = state as AuthorizationFlowState
      return strings.WOULD_YOU_LIKE_TO_ACTION(action)

    default:
      return strings.INCOMING_INTERACTION
  }
}

export default useInteractionTitle
