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

  const onHandleMore = useHandleMorePress()

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
                <View key={`${index}-${c.id}`} style={styles.sectionContainer}>
                  <ScreenContainer.Padding>
                    <DocumentCard
                      credentialName={c.name || t('General.unknown')}
                      holderName={c.holderName}
                      fields={getOptionalFields(c)}
                      photo={c.photo}
                      onHandleMore={() =>
                        onHandleMore(
                          c.id,
                          c.name,
                          [
                            {
                              key: 'subjectName',
                              label: t('Documents.subjectNameField'),
                              value: c.holderName || t('General.anonymous'),
                            },
                            ...getOptionalFields(c),
                          ],
                          c.photo,
                        )
                      }
                    />
                  </ScreenContainer.Padding>
                </View>
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
  },
})
