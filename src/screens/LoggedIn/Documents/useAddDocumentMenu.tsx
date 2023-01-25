import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { IAddDocumentOption } from '../AddDocumentMenu'

export const useAddDocumentMenu = () => {
  const redirect = useRedirect()

  return {
    showMenu: (options: IAddDocumentOption[]) => {
      redirect(ScreenNames.Main, {
        screen: ScreenNames.AddDocumentMenu,
        params: { options },
      })
    },
  }
}
