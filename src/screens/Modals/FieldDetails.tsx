import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useClipboard } from '@react-native-community/hooks'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Block from '~/components/Block'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import { NavHeaderType } from '~/components/NavigationHeader'
import { MainStackParamList } from '../LoggedIn/Main'
import { ScreenNames } from '~/types/screens'
import { useToggleExpand } from '~/hooks/ui'
import Collapsible from '~/components/Collapsible'
import { useToasts } from '~/hooks/toasts'
import useTranslation from '~/hooks/useTranslation'
import { TextLayoutEvent } from '~/types/props'

const IMAGE_SIZE = BP({ large: 100, default: 90 })

type FieldValueProps = { value: string }
const FieldValue: React.FC<FieldValueProps> = ({ value }) => {
  const [clipboardText, setClipboardData] = useClipboard()

  const { scheduleInfo } = useToasts()
  const { t } = useTranslation()

  const [numberOfVisibleLines, setNumberOfVisibleLines] = useState(0)
  const { isExpanded, onToggleExpand } = useToggleExpand()
  const [shouldAppendDots, setAppendDots] = useState(false)
  const wasCalculated = useRef(false)
  /**
   * As soon as the text is available
   * in the clipboard show the notification
   */
  useEffect(() => {
    if (clipboardText) {
      scheduleInfo({
        title: t('Toasts.copied'),
        message: ``,
        dismiss: {
          timeout: 1500,
        },
      })
    }
  }, [clipboardText])

  useEffect(() => () => setClipboardData(''))

  const handleTextLayout = (e: TextLayoutEvent) => {
    const numberOfLines = e.nativeEvent.lines.length
    if (numberOfLines > 4 && !wasCalculated.current) {
      setAppendDots(true)
      setNumberOfVisibleLines(4)
    }
    wasCalculated.current = true
  }

  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
    if (isExpanded) {
      setNumberOfVisibleLines(0)
    } else {
      setNumberOfVisibleLines(4)
    }
  }, [isExpanded])

  return (
    <>
      <TouchableOpacity
        onPress={onToggleExpand}
        onLongPress={() => setClipboardData(value as string)}
        activeOpacity={0.6}
      >
        <JoloText
          // @ts-expect-error
          onTextLayout={handleTextLayout}
          color={Colors.black95}
          numberOfLines={numberOfVisibleLines}
          customStyles={[
            styles.fieldText,
            { marginTop: BP({ default: 8, xsmall: 4 }) },
            !isExpanded && shouldAppendDots && { marginBottom: 15 },
          ]}
        >
          {value}
        </JoloText>
      </TouchableOpacity>
      {!isExpanded && shouldAppendDots && (
        <JoloText
          color={Colors.black95}
          customStyles={{ position: 'absolute', bottom: 10, right: 10 }}
          onPress={onToggleExpand}
        >
          {t('Details.expandBtn')}
        </JoloText>
      )}
    </>
  )
}

const FieldDetails = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.FieldDetails>>()
  const {
    title,
    photo,
    fields,
    backgroundColor = Colors.mainBlack,
  } = route.params

  const { top } = useSafeArea()
  return (
    <View
      style={{
        paddingTop: top,
        backgroundColor,
        height: '100%',
      }}
    >
      <Collapsible
        renderHeader={() => (
          <Collapsible.Header
            customStyles={{ backgroundColor }}
            type={NavHeaderType.Close}
          />
        )}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll disableScrollViewPanResponder>
              <Collapsible.Title
                text={title ?? ''}
                customContainerStyles={{
                  width: photo ? '68%' : '100%',
                  ...(photo && { marginTop: 30 }),
                  paddingBottom: 12,
                }}
              >
                <JoloText
                  customStyles={{
                    ...styles.fieldText,
                    lineHeight: BP({ xsmall: 24, default: 28 }),
                  }}
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.middle}
                  color={Colors.white90}
                  weight={JoloTextWeight.regular}
                >
                  {title}
                </JoloText>
              </Collapsible.Title>
              <Block
                customStyle={{
                  backgroundColor: Colors.white,
                  marginBottom: 16,
                }}
              >
                {photo && (
                  <Image source={{ uri: photo }} style={styles.photo} />
                )}
                {fields.map((field, i) => (
                  <React.Fragment key={i}>
                    <View style={styles.fieldContainer}>
                      <JoloText
                        customStyles={styles.fieldText}
                        size={JoloTextSizes.mini}
                        color={Colors.osloGray}
                      >
                        {field.label}
                      </JoloText>
                      <FieldValue value={field.value as string} />
                    </View>
                    {i !== Object.keys(fields).length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </Block>
            </Collapsible.Scroll>
          </ScreenContainer.Padding>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
  },
  titleContainer: {
    paddingLeft: 6,
    paddingBottom: BP({ default: 12, xsmall: 8 }),
  },
  photo: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    position: 'absolute',
    right: 12,
    top: -IMAGE_SIZE + IMAGE_SIZE * 0.3,
  },
  fieldContainer: {
    paddingVertical: BP({
      default: 16,
      xsmall: 8,
    }),
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    position: 'relative',
  },
  fieldText: {
    textAlign: 'left',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.genevaGray,
    width: '100%',
    opacity: 0.15,
  },
})

export default FieldDetails
