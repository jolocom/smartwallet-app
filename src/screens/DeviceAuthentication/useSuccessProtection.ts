import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import useRedirectTo from '~/hooks/useRedirectTo'
import useDelay from '~/hooks/useDelay'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'

const useSuccessProtection = () => {
  const dispatch = useDispatch()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const handleProtectionSet = async () => {
    dispatch(
      setLoader({
        type: LoaderTypes.success,
        msg: strings.YOU_WILL_BE_PROMPT_TO_USE_BIOMETRY_AS_A_LOCAL_AUTH,
      }),
    )

    await useDelay(() => {
      dispatch(dismissLoader())
      redirectToLoggedIn()
    })
  }

  return handleProtectionSet
}

export default useSuccessProtection
