import { useDispatch } from 'react-redux'
import { setLocalAuth } from '~/modules/account/actions'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'

export const useRedirectToLoggedIn = () => {
  const dispatch = useDispatch()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)
  return () => {
    dispatch(setLocalAuth(true))
    redirectToLoggedIn()
  }
}
