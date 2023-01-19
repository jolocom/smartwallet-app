import { RouteProp, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useMemo,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CrossIcon from '~/assets/svg/CrossIcon'

import { DocumentCard } from '~/components/Cards'
import { CardFavorite } from '~/components/Cards/components'
import {
  DOCUMENT_HEADER_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from '~/components/Cards/consts'
import { getCardDimensions } from '~/components/Cards/ScaledCard/getCardDimenstions'
import { StackData, StackScrollView } from '~/components/CardStack'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import useTranslation from '~/hooks/useTranslation'
import { setOpenedStack } from '~/modules/credentials/actions'
import { DocumentStacks } from '~/modules/credentials/types'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MainTabsParamList } from '../MainTabs'
import { StackExtraData, useDocumentsScreen } from './useDocumentsScreen'
import { useFavoriteDocuments } from './useFavoriteDocuments'

const Documents: React.FC = () => {
  const { t } = useTranslation()

  const { params } =
    useRoute<RouteProp<MainTabsParamList, ScreenNames.Documents>>()

  const prevAddedIds = params?.highlightIds

  const {
    documents,
    getHolderName,
    getHolderPhoto,
    hasImageProperties,
    getPreviewProperties,
  } = useDocuments()

  const {
    stackData,
    handleStackPress,
    openedStack,
    handlePressDetails,
    handlePressMenu,
    isDocumentFavorite,
  } = useDocumentsScreen()

  const { favorites } = useFavoriteDocuments()

  const dispatch = useDispatch()

  const [highlightedCards, setHighlightedCards] = useState<
    string[] | undefined
  >(prevAddedIds)

  useEffect(() => {
    setHighlightedCards(prevAddedIds)
  }, [prevAddedIds])

  useEffect(() => {
    setTimeout(() => {
      setHighlightedCards(undefined)
    }, 100)
  }, [highlightedCards])

  useLayoutEffect(() => {
    if (!favorites.length) {
      dispatch(setOpenedStack(DocumentStacks.All))
    } else {
      dispatch(setOpenedStack(DocumentStacks.Favorites))
    }
  }, [])

  useLayoutEffect(() => {
    if (highlightedCards) {
      dispatch(setOpenedStack(DocumentStacks.All))
    }
  }, [highlightedCards])

  const { scaleBy } = useMemo(
    () =>
      getCardDimensions(
        ORIGINAL_DOCUMENT_CARD_HEIGHT,
        ORIGINAL_DOCUMENT_CARD_WIDTH,
        { originalScreenWidth: ORIGINAL_DOCUMENT_SCREEN_WIDTH },
      ),
    [],
  )

  const toggleMenuModal = () => {}

  const renderStack = useCallback(
    (
      stack: StackData<Document, StackExtraData>,
      stackItems: React.ReactNode,
    ) => {
      return (
        <View key={stack.stackId} style={styles.stackContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleStackPress(stack.stackId as DocumentStacks)}
            style={styles.stackBtn}
          >
            <JoloText kind={JoloTextKind.title} size={JoloTextSizes.mini}>
              {stack.extra.name}
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
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <ScreenContainer.Header
        customStyles={{ marginBottom: 18 }}
        rightButtonIcon={<CrossIcon />}
        rightButtonAction={toggleMenuModal}
      >
        {t('BottomBar.documents')}
      </ScreenContainer.Header>
      {!documents.length ? (
        <ScreenPlaceholder
          title={t('Documents.placeholderHeader')}
          description={t('Documents.documentsPlaceholderSubheader')}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <StackScrollView
            prevAdded={prevAddedIds && prevAddedIds[0]}
            data={stackData}
            itemHeight={ORIGINAL_DOCUMENT_CARD_HEIGHT * scaleBy}
            visibleHeaderHeight={DOCUMENT_HEADER_HEIGHT * scaleBy}
            itemDistance={12}
            // @ts-expect-error FIXME: fix typescript inferrence issue
            renderStack={renderStack}
            renderItem={(c, stack, visible) => {
              const fields = getPreviewProperties(c)

              const shouldHighlight = Boolean(highlightedCards?.includes(c.id))

              return (
                <>
                  <DocumentCard
                    id={c.id}
                    key={c.id}
                    onPress={() => handlePressDetails(c.id)}
                    credentialName={c.name}
                    holderName={getHolderName(c)}
                    fields={fields}
                    photo={getHolderPhoto(c)}
                    onHandleMore={
                      visible ? () => handlePressMenu(c) : undefined
                    }
                    showMenu={visible}
                    backgroundColor={c.style.backgroundColor}
                    backgroundImage={c.style.backgroundImage}
                    issuerIcon={c.issuer.icon}
                    hasImageFields={hasImageProperties(c)}
                    icons={c.style.contextIcons}
                    expired={stack.stackId === DocumentStacks.Expired}
                    highlight={shouldHighlight}
                  />
                  {isDocumentFavorite(c.id) && <CardFavorite />}
                </>
              )
            }}
          />
        </View>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  stackBtn: {
    width: '100%',
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

export default Documents
