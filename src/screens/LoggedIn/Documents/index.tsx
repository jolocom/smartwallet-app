import { RouteProp, useRoute } from '@react-navigation/native'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import CrossIcon from '~/assets/svg/CrossIcon'

import { DocumentCard } from '~/components/Cards'
import { CardFavorite } from '~/components/Cards/components'
import {
  DOCUMENT_HEADER_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
  ORIGINAL_DOCUMENT_SCREEN_WIDTH,
} from '~/components/Cards/consts'
import { BORDER_RADIUS } from '~/components/Cards/DocumentCard'
import { getCardDimensions } from '~/components/Cards/ScaledCard/getCardDimenstions'
import { StackData, StackScrollView } from '~/components/CardStack'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import useTranslation from '~/hooks/useTranslation'
import { setHasDocuments, setOpenedStack } from '~/modules/credentials/actions'
import { getHasDocuments } from '~/modules/credentials/selectors'
import { DocumentStacks } from '~/modules/credentials/types'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MainTabsParamList } from '../MainTabs'
import { useAddDocumentMenu } from './useAddDocumentMenu'
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
  const { showMenu } = useAddDocumentMenu()

  // NOTE: Checking if wallet has Documents when component mounts since adding multiple docs without having one in the wallet
  // will also cause the highlighting animation to run which should only be the case if there are already documents present
  const hasDocuments = useSelector(getHasDocuments)

  const dispatch = useDispatch()

  const [highlightedCards, setHighlightedCards] = useState<
    string[] | undefined
  >(prevAddedIds)

  useLayoutEffect(() => {
    setHighlightedCards(prevAddedIds)
  }, [prevAddedIds])

  useEffect(() => {
    highlightedCards &&
      setTimeout(() => {
        setHighlightedCards(undefined)
        dispatch(setHasDocuments(true))
      }, 4000)
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

  const showAddDocumentMenu = () => {
    showMenu([
      {
        title: t('Documents.addDocumentScanQRCode'),
        navigation: {
          screen: ScreenNames.Interaction,
          params: { screen: ScreenNames.Scanner },
        },
      },
      { title: t('Documents.cancelBtn') },
    ])
  }

  const renderStack = useCallback(
    (
      stack: StackData<Document, StackExtraData>,
      stackItems: React.ReactNode,
    ) => {
      const getDisplayValue = useMemo(
        () =>
          !documents.length
            ? 'flex'
            : openedStack === stack.stackId
            ? 'flex'
            : 'none',
        [openedStack, documents.length],
      )

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
                display: getDisplayValue,
              },
            ]}
          >
            {stack.data.length ? (
              stackItems
            ) : (
              <View style={{ paddingHorizontal: 52 }}>
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
    [openedStack, documents.length],
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
        rightButtonAction={showAddDocumentMenu}
      >
        {t('BottomBar.documents')}
      </ScreenContainer.Header>
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
            // NOTE: we don't highlight the first document that gets added to the wallet since it is already focused.
            const shouldHighlight = Boolean(highlightedCards?.includes(c.id))

            const FadeOutView = () => {
              const opacity = useSharedValue(0)
              const zIndex = useSharedValue(0)

              const animationStyle = useAnimatedStyle(() => ({
                opacity: opacity.value,
                zIndex: zIndex.value,
              }))

              // NOTE: Adding animation for zIndex so card gets clickable (TouchableOpacity, styles.btn below) when animation ends
              const startAnimation = () => {
                opacity.value = withSequence(
                  withDelay(250, withTiming(0.5, { duration: 500 })),
                  withDelay(1250, withTiming(0, { duration: 750 })),
                )
                zIndex.value = withSequence(
                  withDelay(250, withTiming(10, { duration: 500 })),
                  withDelay(1250, withTiming(0, { duration: 750 })),
                )
              }

              useEffect(() => {
                startAnimation()
              }, [shouldHighlight])

              return (
                <Animated.View
                  style={[
                    styles.overlay,
                    animationStyle,
                    { width: ORIGINAL_DOCUMENT_CARD_WIDTH * scaleBy },
                  ]}
                />
              )
            }

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
                  onHandleMore={visible ? () => handlePressMenu(c) : undefined}
                  showMenu={visible}
                  backgroundColor={c.style.backgroundColor}
                  backgroundImage={c.style.backgroundImage}
                  issuerIcon={c.issuer.icon}
                  hasImageFields={hasImageProperties(c)}
                  icons={c.style.contextIcons}
                  expired={stack.stackId === DocumentStacks.Expired}
                />
                {isDocumentFavorite(c.id) && <CardFavorite />}
                {hasDocuments && shouldHighlight && <FadeOutView />}
              </>
            )
          }}
        />
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Colors.success,
    borderRadius: BORDER_RADIUS,
    bottom: 0,
    position: 'absolute',
    top: 0,
  },
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
