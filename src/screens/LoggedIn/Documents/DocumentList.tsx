import React, { useMemo } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { DocumentCard } from '~/components/Cards'
import {
  DOCUMENT_HEADER_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from '~/components/Cards/consts'
import { getCardDimensions } from '~/components/Cards/ScaledCard/getCardDimenstions'
import { StackData, StackScrollView } from '~/components/CardStack'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import { useRedirect } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useDocumentMenu } from './useDocumentMenu'

enum DocumentStacks {
  Favorites = 'Favorites',
  All = 'All',
  Expired = 'Expired',
}

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

  //TODO: add translations (i.e. stackTitle)
  const stackData = useMemo(
    () => [
      { stackId: DocumentStacks.Favorites, data: [] },
      { stackId: DocumentStacks.All, data: documents },
      { stackId: DocumentStacks.Expired, data: [] },
    ],
    [documents],
  )
  const [openedStack, setOpenedStack] = React.useState<DocumentStacks | null>(
    DocumentStacks.Favorites,
  )
  const handleStackPress = (stackId: DocumentStacks) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenedStack(stackId)
  }

  const renderStack = (
    stack: StackData<Document>,
    stackItems: React.ReactNode,
  ) => {
    return (
      <View key={stack.stackId} style={styles.stackContainer}>
        <TouchableOpacity
          onPress={() => handleStackPress(stack.stackId as DocumentStacks)}
          style={styles.stackBtn}
        >
          <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini}>
            {stack.stackId}
          </JoloText>
          <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini}>
            {stack.data.length}
          </JoloText>
        </TouchableOpacity>
        {openedStack === stack.stackId && stack.data.length !== 0 && (
          <View style={styles.stackItems}>{stackItems}</View>
        )}
      </View>
    )
  }

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
            data={stackData}
            itemHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT * scaleBy}
            visibleHeaderHeight={DOCUMENT_HEADER_HEIGHT * scaleBy}
            itemDistance={12}
            renderStack={renderStack}
            renderItem={(c, visible) => {
              const previewFields = getPreviewProperties(c)

              const fields = previewFields.length
                ? previewFields
                : getExtraProperties(c)

              return (
                <DocumentCard
                  id={c.id}
                  key={c.id}
                  onPress={() => handlePressDetails(c.id)}
                  credentialName={c.name}
                  holderName={getHolderName(c)}
                  fields={fields}
                  photo={getHolderPhoto(c)}
                  onHandleMore={visible ? () => handlePressMore(c) : undefined}
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

const styles = StyleSheet.create({
  stackBtn: {
    flex: 1,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.mainDark,
    flexDirection: 'row',
    borderRadius: 6,
  },
  stackContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stackItems: {
    marginTop: 24,
  },
})
