import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View } from 'react-native'
import { DisplayVal } from '@jolocom/sdk/js/credentials'

import { getAllDocuments } from '~/modules/credentials/selectors'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { ScreenNames } from '~/types/screens'
import useTranslation from '~/hooks/useTranslation'
import {
  useCredentialOptionalFields,
  useDeleteCredential,
} from '~/hooks/credentials'
import { useToasts } from '~/hooks/toasts'
import { usePopupMenu } from '~/hooks/popupMenu'
import { DocumentCard } from '~/components/Cards'
import { truncateString } from '~/utils/stringUtils'
import ScreenContainer from '~/components/ScreenContainer'
import { DisplayCredentialDocument } from '~/types/credentials'
import { useRedirect } from '~/hooks/navigation'
import { ClaimMimeType } from '@jolocom/protocol-ts'

const useHandleMorePress = () => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()

  const { showPopup } = usePopupMenu()
  const deleteCredential = useDeleteCredential()

  const handleDelete = (id: string) => {
    deleteCredential(id).catch(scheduleErrorWarning)
  }

  return (
    id: string,
    credentialName: string,
    fields: Array<DisplayVal>,
    photo?: string,
  ) => {
    const displayDocumentName = truncateString(credentialName, 30)
    const popupOptions = [
      {
        title: t('Documents.infoCardOption'),
        navigation: {
          screen: ScreenNames.FieldDetails,
          params: {
            fields,
            photo,
            title: displayDocumentName,
            backgroundColor: undefined,
          },
        },
      },
      {
        title: t('Documents.deleteCardOption'),
        navigation: {
          screen: ScreenNames.DragToConfirm,
          params: {
            title: t('Documents.deleteDocumentHeader', {
              documentName: displayDocumentName,
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

const CardList: React.FC = ({ children }) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    overScrollMode={'never'}
    contentContainerStyle={{
      paddingBottom: '40%',
      paddingTop: 32,
    }}
  >
    {children}
  </ScrollView>
)

export const DocumentList = () => {
  const { t } = useTranslation()
  const { getOptionalFields, getPreviewFields } = useCredentialOptionalFields()
  const documents = useSelector(getAllDocuments)
  const redirect = useRedirect()

  const onHandleMore = useHandleMorePress()

  const handlePressDetails = (c: DisplayCredentialDocument) => {
    const displayDocumentName = c.name

    redirect(ScreenNames.FieldDetails, {
      fields: assembleFields(c),
      photo: c.photo,
      title: displayDocumentName,
      contextIcons: getContextIcons(c),
      issuerIcon: c.issuer?.publicProfile?.image,
      backgroundColor: undefined,
    })
  }

  const assembleFields = (c: DisplayCredentialDocument) => {
    return [
      {
        key: 'subjectName',
        label: t('Documents.subjectNameField'),
        value: c.holderName || t('General.anonymous'),
        mime_type: ClaimMimeType.text_plain,
        preview: false,
      },
      ...getOptionalFields(c),
    ]
  }

  const handlePressMore = (c: DisplayCredentialDocument) => {
    onHandleMore(c.id, c.name, assembleFields(c), c.photo)
  }

  const getContextIcons = (c: DisplayCredentialDocument) => {
    const heroIcon = c.styles?.hero?.uri
    const thumbnailIcon = c.styles?.thumbnail?.uri
    const contextIcons: string[] = []

    if (heroIcon) {
      contextIcons.push(heroIcon)
    }
    if (thumbnailIcon) {
      contextIcons.push(thumbnailIcon)
    }

    return contextIcons
  }

  if (!documents) return null
  return (
    <>
      <View
        style={{
          flex: 1,
        }}
        testID="document-cards-container"
      >
        {!documents.length ? (
          <ScreenPlaceholder
            title={t('Documents.placeholderHeader')}
            description={t('Documents.documentsPlaceholderSubheader')}
          />
        ) : (
          <CardList>
            {documents.map((c, index) => {
              const hasImageFields = c.properties.some(
                (prop) => prop.mime_type === ClaimMimeType.image_png,
              )
              const previewFields = getPreviewFields(c)

              const fields = previewFields.length
                ? previewFields
                : getOptionalFields(c)

              return (
                <ScreenContainer.Padding key={`${index}-${c.id}`}>
                  <View style={styles.sectionContainer}>
                    <DocumentCard
                      onPress={() => handlePressDetails(c)}
                      credentialName={c.name || t('General.unknown')}
                      holderName={c.holderName}
                      fields={fields}
                      photo={c.photo}
                      onHandleMore={() => handlePressMore(c)}
                      backgroundColor={c.styles?.background?.color}
                      backgroundImage={c.styles?.background?.image_url?.uri}
                      issuerIcon={c.issuer?.publicProfile?.image}
                      hasImageFields={hasImageFields}
                      icons={getContextIcons(c)}
                    />
                  </View>
                </ScreenContainer.Padding>
              )
            })}
          </CardList>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingBottom: 22,
    alignItems: 'center',
  },
})
