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
import { StackScrollView } from '~/components/CardStack'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { ORIGINAL_DOCUMENT_CARD_HEIGHT } from '~/components/Cards/consts'
import { debugView } from '~/utils/dev'

const useHandleMorePress = () => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()

  const { showPopup } = usePopupMenu()
  const deleteCredential = useDeleteCredential()

  const handleDelete = (id: string) => {
    deleteCredential(id).catch(scheduleErrorWarning)
  }

  return ({
    id,
    credentialName,
    fields,
    issuerIcon,
    photo,
    contextIcons,
  }: {
    id: string
    credentialName: string
    fields: Array<DisplayVal>
    issuerIcon?: string
    photo?: string
    contextIcons?: string[]
  }) => {
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
            contextIcons,
            issuerIcon,
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

  // FIXME this has to be abstracted since we're duplicating a lot of things.
  // The whole credential screen and how we're interacting with it should change
  const handlePressDetails = (c: DisplayCredentialDocument) => {
    redirect(ScreenNames.FieldDetails, {
      fields: assembleFields(c),
      photo: c.photo,
      title: c.name,
      contextIcons: getContextIcons(c),
      issuerIcon: c.issuer?.publicProfile?.image,
      backgroundColor: undefined,
    })
  }

  const handlePressMore = (c: DisplayCredentialDocument) => {
    onHandleMore({
      id: c.id,
      credentialName: c.name,
      fields: assembleFields(c),
      photo: c.photo,
      contextIcons: getContextIcons(c),
      issuerIcon: c.issuer?.publicProfile?.image,
    })
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
          <StackScrollView
            data={[
              { stackId: 'Favorites', data: documents },
              { stackId: 'All', data: documents },
            ]}
            itemHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT}
            visibleHeaderHeight={20}
            itemDistance={12}
            renderStack={(stack, Item) => {
              return (
                <ScreenContainer.Padding>
                  <View style={{ width: '100%', justifyContent: 'center' }}>
                    <JoloText kind={JoloTextKind.title}>
                      {stack.stackId}
                    </JoloText>
                    {Item}
                  </View>
                </ScreenContainer.Padding>
              )
            }}
            renderItem={(c) => {
              const hasImageFields = c.properties.some(
                (prop) => prop.mime_type === ClaimMimeType.image_png,
              )
              const previewFields = getPreviewFields(c)

              const fields = previewFields.length
                ? previewFields
                : getOptionalFields(c)

              return (
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
              )
            }}
          />
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
