import Rate, { AndroidMarket } from 'react-native-rate'
import { Platform } from 'react-native'

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
    await disableLock(ratePromise)
  }

  return { rateApp }
}

export default useMarketRating
