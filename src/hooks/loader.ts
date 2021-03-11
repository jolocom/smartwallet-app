import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'
import { useDelay } from './generic'

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
    onDone: (success: boolean) => void = () => {},
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

      if (showSuccess) {
        dispatch(
          setLoader({
            type: LoaderTypes.success,
            msg: success,
          }),
        )
        setTimeout(() => {
          dispatch(dismissLoader())
          onDone(true)
        }, 3000)
      } else {
        dispatch(dismissLoader())
        onDone(true)
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
          dispatch(dismissLoader());
          onDone(false)
        }, 3000)
        
      } else {
        dispatch(dismissLoader())
        onDone(false)
      }
    }
  }
}

const openLoader = (type: LoaderTypes, msg: string) => (
  delay: number = 4000,
) => {
  const dispatch = useDispatch()

  return async (onComplete?: () => void) => {
    dispatch(
      setLoader({
        type,
        msg,
      }),
    )
    if (onComplete) {
      await useDelay(onComplete, 100)
    }

    await useDelay(() => {
      dispatch(dismissLoader())
    }, delay)
  }
}

export const useSuccess = openLoader(LoaderTypes.success, strings.SUCCESS)
export const useFailed = openLoader(LoaderTypes.error, strings.FAILED)
