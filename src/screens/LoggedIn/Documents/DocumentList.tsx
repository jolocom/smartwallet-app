import React from 'react'
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
    fields: Array<Required<DisplayVal>>,
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
  const { getOptionalFields } = useCredentialOptionalFields()
  const documents = useSelector(getAllDocuments)
  const redirect = useRedirect()

  const onHandleMore = useHandleMorePress()

  const handlePressDetails = (c: DisplayCredentialDocument) => {
    const displayDocumentName = truncateString(c.name, 30)

    redirect(ScreenNames.FieldDetails, {
      fields: assembleFields(c),
      photo: c.photo,
      title: displayDocumentName,
      backgroundColor: undefined,
    })
  }

  const assembleFields = (c: DisplayCredentialDocument) => {
    return [
      {
        key: 'subjectName',
        label: t('Documents.subjectNameField'),
        value: c.holderName || t('General.anonymous'),
      },
      ...getOptionalFields(c),
    ]
  }

  const handlePressMore = (c: DisplayCredentialDocument) => {
    onHandleMore(c.id, c.name, assembleFields(c), c.photo)
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
              return (
                <ScreenContainer.Padding key={`${index}-${c.id}`}>
                  <View style={styles.sectionContainer}>
                    <DocumentCard
                      onPress={() => handlePressDetails(c)}
                      credentialName={c.name || t('General.unknown')}
                      holderName={c.holderName}
                      fields={getOptionalFields(c)}
                      photo={c.photo}
                      onHandleMore={() => handlePressMore(c)}
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
