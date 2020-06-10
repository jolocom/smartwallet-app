import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'
import useDelay from '~/hooks/useDelay'

const useSuccess = (delay: number = 4000) => {
  const dispatch = useDispatch()

  return async () => {
    dispatch(
      setLoader({
        type: LoaderTypes.success,
        msg: strings.SUCCESS,
      }),
    )

    await useDelay(() => {
      dispatch(dismissLoader())
    }, delay)
  }
}

export default useSuccess
