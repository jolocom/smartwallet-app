import React, { useCallback, useMemo } from 'react'
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

  //TODO: add translations (i.e. stackTitle, placeholders)
  const stackData = useMemo<
    StackData<Document, { title: string; subtitle: string }>[]
  >(
    () => [
      {
        stackId: DocumentStacks.Favorites,
        data: [],
        extra: {
          title: 'Nothing here yet',
          subtitle:
            'Favourite a document by tapping the star icon on a document.',
        },
      },
      {
        stackId: DocumentStacks.All,
        data: documents,
        extra: {
          title: 'It’s still empty',
          subtitle: "You haven't saved any documents yet. Get one today!",
        },
      },
      {
        stackId: DocumentStacks.Expired,
        data: [],
        extra: {
          title: 'It’s still empty',
          subtitle: 'You don’t have any expired documents.',
        },
      },
    ],
    [documents],
  )
  const [openedStack, setOpenedStack] = React.useState<DocumentStacks | null>(
    DocumentStacks.Favorites,
  )

  const handleStackPress = (stackId: DocumentStacks) => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    })
    if (openedStack === stackId) {
      setOpenedStack(null)
    } else {
      setOpenedStack(stackId)
    }
  }

  const renderStack = useCallback(
    (
      stack: StackData<Document, { title: string; subtitle: string }>,
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
          <View
            style={[
              styles.stackItems,
              {
                // NOTE: Opening and closing using the display style instead of conditionally rendering
                // the component is faster, but the exiting layout animation is messed up. Also, this makes memoization
                // work, where each component is only rendered once. Otherwise, with conditional rendering
                // each card is rendered twice.
                display: openedStack === stack.stackId ? 'flex' : 'none',
              },
            ]}
          >
            {stack.data.length ? (
              stackItems
            ) : (
              <View style={{ paddingHorizontal: 80 }}>
                <JoloText
                  size={JoloTextSizes.middle}
                  color={Colors.white90}
                  customStyles={{ marginBottom: 4 }}
                >
                  {stack.extra.title}
                </JoloText>
                <JoloText size={JoloTextSizes.mini}>
                  {stack.extra.subtitle}
                </JoloText>
              </View>
            )}
          </View>
        </View>
      )
    },
    [openedStack],
  )

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
            // @ts-expect-error FIXME: fix typescript inferrence issue
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
