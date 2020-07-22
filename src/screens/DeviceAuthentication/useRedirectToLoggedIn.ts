import { useDispatch } from 'react-redux'
import { setLocalAuth, unlockApp } from '~/modules/account/actions'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'

export const useRedirectToLoggedIn = () => {
  const dispatch = useDispatch()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)
  return () => {
    dispatch(setLocalAuth())
    dispatch(unlockApp())
    redirectToLoggedIn()
  }
}
