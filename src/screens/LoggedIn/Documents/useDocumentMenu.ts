import { useDocuments } from '~/hooks/documents'
import { usePopupMenu } from '~/hooks/popupMenu'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { useFavoriteDocuments } from './useFavoriteDocuments'

export const useDocumentMenu = () => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()
  const { deleteDocument, getDocumentById } = useDocuments()
  const { addFavorite, favorites, deleteFavorite } = useFavoriteDocuments()

  const { showPopup } = usePopupMenu()

  const handleDelete = (id: string) => {
    deleteDocument(id).catch(scheduleErrorWarning)
  }

  return ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
    const document = getDocumentById(id)!
    const popupOptions = [
      {
        title: t('Documents.infoCardOption'),
        navigation: {
          screen: ScreenNames.FieldDetails,
          params: {
            id,
          },
        },
      },
      isFavorite
        ? {
            title: t('Documents.removeFavorite'),
            onPress: () => {
              deleteFavorite(id)
            },
          }
        : {
            title: t('Documents.addFavorite'),
            onPress: () => {
              addFavorite(id)
            },
          },
      {
        title: t('Documents.deleteCardOption'),
        navigation: {
          screen: ScreenNames.DragToConfirm,
          params: {
            title: t('Documents.deleteDocumentHeader', {
              documentName: document.name,
              interpolation: { escapeValue: false },
            }),
            cancelText: t('Documents.cancelCardOption'),
            instructionText: t('Documents.deleteCredentialInstruction'),
            onComplete: () => handleDelete(id),
          },
        },
      },
    ]
    showPopup(popupOptions)
  }
}
