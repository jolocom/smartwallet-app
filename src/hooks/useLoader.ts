import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'

export interface LoaderConfig {
  showFailed?: boolean
  showSuccess?: boolean
  loading?: string
  success?: string
  failed?: string
}

const defaultConfig = {
  loading: strings.LOADING,
  showFailed: true,
  showSuccess: true,
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
      showSuccess = defaultConfig.showSuccess,
      showFailed = defaultConfig.showFailed,
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
      await callback();
      result = true
      if (showSuccess) {
        dispatch(
          setLoader({
            type: LoaderTypes.success,
            msg: success,
          }),
        )
      } else {
        dispatch(dismissLoader())
      }
    } catch (err) {
      console.warn(err)
      if (showFailed) {
        dispatch(
          setLoader({
            type: LoaderTypes.error,
            msg: failed,
          }),
        )
      } else {
        dispatch(dismissLoader())
      }
      result = false
    }

    return result
  }
}
