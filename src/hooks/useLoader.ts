import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import useDelay from './useDelay'
import { strings } from '~/translations/strings'

export interface LoaderConfig {
  showStatus: boolean
  loading?: string
  success?: string
  failed?: string
}

const defaultConfig = {
  loading: strings.LOADING,
  showStatus: true,
  success: strings.SUCCESS,
  failed: strings.FAILED,
}

export const useLoader = () => {
  const dispatch = useDispatch()

  return async (
    callback: () => Promise<any>,
    config: LoaderConfig = defaultConfig,
  ) => {
    const {
      showStatus,
      loading = defaultConfig.loading,
      success = defaultConfig.success,
      failed = defaultConfig.failed,
    } = config

    dispatch(
      setLoader({
        type: LoaderTypes.default,
        msg: loading,
      }),
    )

    let result
    try {
      await callback()
      result = true
      if (showStatus)
        dispatch(
          setLoader({
            type: LoaderTypes.success,
            msg: success,
          }),
        )
      await useDelay(() => dispatch(dismissLoader()))
    } catch (err) {
      if (showStatus)
        dispatch(
          setLoader({
            type: LoaderTypes.error,
            msg: failed,
          }),
        )
      await useDelay(() => dispatch(dismissLoader()))
      result = false
    }

    return !!result
  }
}
