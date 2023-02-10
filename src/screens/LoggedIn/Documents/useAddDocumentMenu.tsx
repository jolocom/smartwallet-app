import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { AddDocumentOption } from '../AddDocumentMenu'

export const useAddDocumentMenu = () => {
  const redirect = useRedirect()

  return {
    showMenu: (options: AddDocumentOption[]) => {
      redirect(ScreenNames.Main, {
        screen: ScreenNames.AddDocumentMenu,
        params: { options },
      })
    },
  }
}
