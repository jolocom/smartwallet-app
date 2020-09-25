import { useSelector } from 'react-redux'

import { strings } from '~/translations/strings'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import { getActiveInteraction } from '~/modules/interaction/selectors'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
} from '~/modules/interaction/guards'

export default function useInteractionCta() {
  const details = useSelector(getActiveInteraction)
  const { getSingleMissingAttribute } = useCredentialShareFlow()

  if (isAuthDetails(details)) {
    return strings.AUTHENTICATE
  } else if (isAuthzDetails(details)) {
    const { action } = details
    const ctaWord = action ? truncateFirstWord(action) : strings.AUTHORIZE
    const ctaCapitalized = capitalizeWord(ctaWord)
    return ctaCapitalized
  } else if (isCredOfferDetails(details)) {
    return strings.RECEIVE
  } else if (isCredShareDetails(details)) {
    return getSingleMissingAttribute() ? strings.ADD_INFO : strings.SHARE
  } else {
    return ''
  }
}
