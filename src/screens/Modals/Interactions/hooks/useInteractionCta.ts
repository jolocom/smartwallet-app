import { strings } from '~/translations/strings'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
} from '~/modules/interaction/guards'
import { useRootSelector } from '~/hooks/useRootSelector'

export default function useInteractionCta() {
  const details = useRootSelector(getInteractionDetails)

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
    return strings.SHARE
  } else {
    return ''
  }
}
