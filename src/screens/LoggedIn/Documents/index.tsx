import React, { useCallback, useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

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
import ScreenContainer from '~/components/ScreenContainer'
import ScreenPlaceholder from '~/components/ScreenPlaceholder'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import {
  DocumentStacks,
  StackExtraData,
  useDocumentsScreen,
} from './useDocumentsScreen'

const Documents: React.FC = () => {
  const { t } = useTranslation()

  const {
    documents,
    getHolderName,
    getHolderPhoto,
    hasImageProperties,
    getExtraProperties,
    getPreviewProperties,
  } = useDocuments()
  const {
    stackData,
    handleStackPress,
    openedStack,
    handlePressDetails,
    handlePressMenu,
  } = useDocumentsScreen()

  const { scaleBy } = useMemo(
    () =>
      getCardDimensions(
        ORIGINAL_DOCUMENT_CARD_HEIGHT,
        ORIGINAL_DOCUMENT_CARD_WIDTH,
        { originalScreenWidth: ORIGINAL_DOCUMENT_SCREEN_WIDTH },
      ),
    [],
  )

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
      <ScreenContainer.Header customStyles={{ marginBottom: 18 }}>
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
                  onHandleMore={visible ? () => handlePressMenu(c) : undefined}
                  backgroundColor={c.style.backgroundColor}
                  backgroundImage={c.style.backgroundImage}
                  issuerIcon={c.issuer.icon}
                  hasImageFields={hasImageProperties(c)}
                  icons={c.style.contextIcons}
                />
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
