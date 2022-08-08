import React, { useMemo } from 'react'
import { View } from 'react-native'

import { DocumentCard } from '~/components/Cards'
import {
  DOCUMENT_HEADER_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from '~/components/Cards/consts'
import { getCardDimensions } from '~/components/Cards/ScaledCard/getCardDimenstions'
import { StackScrollView } from '~/components/CardStack'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import { useRedirect } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { JoloTextSizes } from '~/utils/fonts'
import { useDocumentMenu } from './useDocumentMenu'

export const DocumentList = () => {
  const { t } = useTranslation()
  const {
    documents,
    getHolderName,
    getHolderPhoto,
    hasImageProperties,
    getExtraProperties,
    getPreviewProperties,
  } = useDocuments()
  const redirect = useRedirect()

  const onHandleMore = useDocumentMenu()

  const handlePressDetails = (id: string) => {
    redirect(ScreenNames.Main, {
      screen: ScreenNames.FieldDetails,
      params: {
        id,
      },
    })
  }

  const handlePressMore = (c: Document) => {
    onHandleMore({
      id: c.id,
    })
  }

  const { scaleBy } = useMemo(
    () =>
      getCardDimensions(
        ORIGINAL_DOCUMENT_CARD_HEIGHT,
        ORIGINAL_DOCUMENT_CARD_WIDTH,
        { originalScreenWidth: ORIGINAL_DOCUMENT_SCREEN_WIDTH },
      ),
    [],
  )

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
            data={[{ stackId: 'Favorites', data: documents }]}
            itemHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT}
            visibleHeaderHeight={DOCUMENT_HEADER_HEIGHT * scaleBy}
            itemDistance={12}
            renderStack={(stack, Item) => {
              return (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                  }}
                >
                  <JoloText
                    customStyles={{ marginBottom: 24, textAlign: 'left' }}
                    kind={JoloTextKind.title}
                    size={JoloTextSizes.mini}
                  >
                    {stack.stackId}
                  </JoloText>
                  {Item}
                </View>
              )
            }}
            renderItem={(c) => {
              const previewFields = getPreviewProperties(c)

              const fields = previewFields.length
                ? previewFields
                : getExtraProperties(c)

              return (
                <DocumentCard
                  onPress={() => handlePressDetails(c.id)}
                  credentialName={c.name}
                  holderName={getHolderName(c)}
                  fields={fields}
                  photo={getHolderPhoto(c)}
                  onHandleMore={() => handlePressMore(c)}
                  backgroundColor={c.style.backgroundColor}
                  backgroundImage={c.style.backgroundImage}
                  issuerIcon={c.issuer.icon}
                  hasImageFields={hasImageProperties(c)}
                  icons={c.style.contextIcons}
                />
              )
            }}
          />
        )}
      </View>
    </>
  )
}
