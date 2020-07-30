import {
  FlowType,
  InteractionSummary,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { useSelector } from 'react-redux'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import truncateDid from '~/utils/truncateDid'

const getDescriptionText = (flowType: FlowType | null) => {
  const { state, initiator }: InteractionSummary = useSelector(
    getInteractionSummary,
  )
  const serviceName = initiator.publicProfile?.name
  const isAnonimous = !!initiator.publicProfile

  if (isAnonimous)
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
