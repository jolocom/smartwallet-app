import { Platform } from 'react-native'
import Rate, { AndroidMarket } from 'react-native-rate'

import { useDisableLock } from './generic'

const options = {
  AppleAppID: '1223869062',
  GooglePackageName: 'com.jolocomwallet',
  preferInApp: Platform.OS === 'ios',
  openAppStoreIfInAppFails: true,
  preferredAndroidMarket: AndroidMarket.Google,
}

const useMarketRating = () => {
  const disableLock = useDisableLock()

  const ratePromise = () => {
    return new Promise<void>((res, rej) => {
      Rate.rate(options, (success) => {
        if (success) res()
        rej('Failed to rate the app')
      })
    })
  }

  const rateApp = async () => {
    if (Platform.OS === 'ios') {
      return disableLock(ratePromise)
    }

    // NOTE: On Android we're navigating to the app store instead of a rating page. Hence, we shouldn't disable the lock
    // since that will leave the app unprotected.
    return ratePromise()
  }

  return { rateApp }
}

export default useMarketRating
