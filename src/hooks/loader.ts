import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'
import { sleep } from '~/utils/generic'

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
    onDone: (error?: Error) => void = () => {},
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

    try {
      await callback()
      await sleep(1000)

      if (showSuccess) {
        dispatch(
          setLoader({
            type: LoaderTypes.success,
            msg: success,
          }),
        )
        setTimeout(() => {
          dispatch(dismissLoader())
          onDone()
        }, 3000)
      } else {
        dispatch(dismissLoader())
        onDone()
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
        setTimeout(() => {
          dispatch(dismissLoader())
          onDone(err)
        }, 3000)
      } else {
        dispatch(dismissLoader())
        onDone(err)
      }
    }
  }
}

const openLoader = (type: LoaderTypes, msg: string) => (
  delay: number = 2500,
) => {
  const dispatch = useDispatch()

  return (onComplete?: () => void) => {
    dispatch(
      setLoader({
        type,
        msg,
      }),
    )
    setTimeout(() => {
      onComplete && onComplete()
      dispatch(dismissLoader())
    }, delay)
  }
}

export const useSuccess = openLoader(LoaderTypes.success, strings.SUCCESS)
export const useFailed = openLoader(LoaderTypes.error, strings.FAILED)
