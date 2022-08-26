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

  const isFavorite = (id: string) => {
    return Boolean(favorites.find((d) => d.id === id))
  }

  return ({ id }: { id: string }) => {
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
      isFavorite(id)
        ? {
            title: 'Remove from Favorites',
            onPress: () => {
              deleteFavorite(id)
            },
        }
        : {
            title: 'Add to Favorites',
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
