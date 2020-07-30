import {
  FlowType,
  InteractionSummary,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import {
  getInteractionSummary,
  getIntermediaryState,
  getAttributeInputKey,
} from '~/modules/interaction/selectors'
import truncateDid from '~/utils/truncateDid'
import { IntermediaryState } from '~/modules/interaction/types'

const getDescriptionText = (flowType: FlowType | null) => {
  const { initiator }: InteractionSummary = useSelector(getInteractionSummary)
  const intermediaryState = useSelector(getIntermediaryState)
  const inputType = useSelector(getAttributeInputKey)
  const serviceName = initiator.publicProfile?.name
  const isAnonymous = !initiator.publicProfile

  if (intermediaryState === IntermediaryState.showing)
    return `You will immidiately find your ${inputType} in the personal info section after all`

  if (isAnonymous)
    return `This public profile ${truncateDid(
      initiator.did,
    )} chose to remain anonymous. Pay attention before sharing data.`

  //TODO: @clauxx add strings
  switch (flowType) {
    case FlowType.Authentication:
      //TODO: ask what is the right fallback for anonymous
      return `${serviceName} would like to confirm your digital identity before proceeding`
    case FlowType.Authorization:
      return `${serviceName} is now ready to grant you access`
    case FlowType.CredentialShare:
      return `Choose one or more documents requested by ${serviceName} to proceed `
    case FlowType.CredentialReceive:
      return `${serviceName} sent your wallet the following document(s):`
    default:
      return 'Incoming interaction'
  }
}

export default getDescriptionText
