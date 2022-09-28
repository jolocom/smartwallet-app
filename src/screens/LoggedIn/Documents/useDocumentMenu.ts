import { useDocuments } from '~/hooks/documents'
import { usePopupMenu } from '~/hooks/popupMenu'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { MDL_CREDENTIAL_TYPE } from './DrivingLicenseDemo/data'
import { useDrivingLicense } from './DrivingLicenseDemo/hooks'
import { useFavoriteDocuments } from './useFavoriteDocuments'

export const useDocumentMenu = () => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()
  const { deleteDocument, getDocumentById } = useDocuments()
  const { addFavorite, deleteFavorite } = useFavoriteDocuments()
  const { deleteDrivingLicense, shareDrivingLicense } = useDrivingLicense()

  const { showPopup } = usePopupMenu()

  const handleDelete = (id: string) => {
    deleteDocument(id).catch(scheduleErrorWarning)
  }

  return ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
    const document = getDocumentById(id)!
    const isDrivingLicense = document.type[1] === MDL_CREDENTIAL_TYPE
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
            onComplete: () => {
              if (isDrivingLicense) {
                deleteDrivingLicense().catch(scheduleErrorWarning)
              }

              handleDelete(id)
            },
          },
        },
      },
    ]

    if (isDrivingLicense) {
      popupOptions.splice(1, 0, {
        title: t('CredentialRequest.acceptBtn'),
        onPress: () => {
          shareDrivingLicense()
        },
      })
    }

    showPopup(popupOptions)
  }
}
