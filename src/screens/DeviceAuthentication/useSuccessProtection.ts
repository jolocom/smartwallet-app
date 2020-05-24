import { useDispatch } from 'react-redux'

import { setLoader } from '~/modules/loader/actions'
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
        msg: strings.SUCCESS_SETTING_UP_ADDITIONAL_PROTECTION,
      }),
    )
    await useDelay(redirectToLoggedIn)
  }

  return handleProtectionSet
}

export default useSuccessProtection
