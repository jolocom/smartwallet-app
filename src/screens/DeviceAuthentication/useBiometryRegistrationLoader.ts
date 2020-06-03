import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import useRedirectTo from '~/hooks/useRedirectTo'
import useDelay from '~/hooks/useDelay'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'

const useBiometryRegistrationLoader = () => {
  const dispatch = useDispatch()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const handleProtectionSet = async () => {
    dispatch(
      setLoader({
        type: LoaderTypes.success,
        msg: strings.SUCCESS,
      }),
    )

    await useDelay(() => {
      dispatch(dismissLoader())
      redirectToLoggedIn()
    }, 4000)
  }

  return handleProtectionSet
}

export default useBiometryRegistrationLoader
