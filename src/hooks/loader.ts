import { useDispatch } from 'react-redux'

import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { sleep } from '~/utils/generic'
import useTranslation from './useTranslation'

export interface LoaderConfig {
  showFailed?: boolean
  showSuccess?: boolean
  loading?: string
  success?: string
  failed?: string
}

export const useLoader = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const defaultConfig = {
    loading: t('Loader.loading'),
    showFailed: true,
    showSuccess: true,
    success: t('Loader.successDefault'),
    failed: t('Loader.failedDefault'),
  }

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

const openLoader = (type: LoaderTypes, msg: string) => (delay: number) => {
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

export const useSuccess = (delay: number = 2500) => {
  const { t } = useTranslation()

  return openLoader(LoaderTypes.success, t('Loader.successDefault'))(delay)
}

export const useFailed = (delay: number = 2500) => {
  const { t } = useTranslation()

  return openLoader(LoaderTypes.error, t('Loader.failedDefault'))(delay)
}
