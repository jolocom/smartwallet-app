import { useDispatch } from 'react-redux'
import { LoaderTypes } from '~/modules/loader/types'
import { strings } from '~/translations/strings'
import { setLoader, dismissLoader } from '~/modules/loader/actions'
import SDK from '~/utils/SDK'
import useRedirectTo from './useRedirectTo'
import { ScreenNames } from '~/types/screens'

export enum IdentityMethods {
  // createIdentity = 'createIdentity',
  recoverIdentity = 'recoverIdentity',
}

const useIdentityOperation = <T>(
  identityMethod: IdentityMethods,
  input: T,
): (() => void) => {
  const dispatch = useDispatch()
  const redirectToSeedPhrase = useRedirectTo(ScreenNames.SeedPhrase)

  const process = async () => {
    dispatch(setLoader({ type: LoaderTypes.default, msg: strings.MATCHING }))

    try {
      await SDK[identityMethod]<T>(input)
      setTimeout(() => {
        dispatch(dismissLoader())
        redirectToSeedPhrase()
      }, 3000)
    } catch (err) {
      dispatch(setLoader({ type: LoaderTypes.error, msg: strings.FAILED }))
      setTimeout(() => {
        dispatch(dismissLoader())
      }, 3000)
    }
  }
  return process
}

export default useIdentityOperation
