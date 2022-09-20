import { IPopupOption } from '~/screens/LoggedIn/PopupMenu'
import { ScreenNames } from '~/types/screens'
import { useRedirect } from './navigation'

export const usePopupMenu = () => {
  const redirect = useRedirect()

  return {
    showPopup: (options: IPopupOption[]) => {
      redirect(ScreenNames.TransparentModals, {
        screen: ScreenNames.PopupMenu,
        params: { options },
      })
    },
  }
}
