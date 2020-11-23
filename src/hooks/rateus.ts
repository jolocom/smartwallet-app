import Rate, { AndroidMarket } from 'react-native-rate'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setPopup } from '~/modules/appState/actions'

const options = {
  AppleAppID: '1223869062',
  GooglePackageName: 'com.jolocomwallet',
  preferInApp: true,
  openAppStoreIfInAppFails: true,
  preferredAndroidMarket: AndroidMarket.Google,
}

const useMarketRating = () => {
  const [isRated, setIsRated] = useState(false)
  const dispatch = useDispatch()

  const rateApp = () => {
    dispatch(setPopup(true))
    Rate.rate(options, (success) => {
      setIsRated(success)
      dispatch(setPopup(false))
    })
  }

  return { isRated, rateApp }
}

export default useMarketRating
