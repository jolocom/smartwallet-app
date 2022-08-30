import { useDocuments } from '~/hooks/documents'
import { usePopupMenu } from '~/hooks/popupMenu'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'

export const useDocumentMenu = () => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()
  const { deleteDocument, getDocumentById } = useDocuments()

  const { showPopup } = usePopupMenu()

  const handleDelete = (id: string) => {
    deleteDocument(id).catch(scheduleErrorWarning)
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
