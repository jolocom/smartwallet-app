import React, { useState, useRef } from 'react'
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
  const [_, setClipboardData] = useClipboard()

  const { scheduleInfo } = useToasts()
  const { t } = useTranslation()

  const [numberOfVisibleLines, setNumberOfVisibleLines] = useState(5)
  const [seeMoreBtnVisible, setSeeMoreBtnVisibility] = useState(false)

  const { isExpanded, onToggleExpand } = useToggleExpand({
    onExpand: () => {
      setNumberOfVisibleLines(0)
    },
    onCollapse: () => {
      setNumberOfVisibleLines(4)
    },
  })

  const handleLongPress = (value: string) => {
    setClipboardData(value as string)
    scheduleInfo({
      title: t('Toasts.copied'),
      message: ``,
      dismiss: 1500,
    })
  }

  const originalNrLines = useRef<number | null>(null)

  /**
   * Decide whether to render 'Show more' btn to expand a
   * field content
   */
  const handleTextLayout = (e: TextLayoutEvent) => {
    if (originalNrLines.current === null) {
      originalNrLines.current = e.nativeEvent.lines.length
      if (originalNrLines.current > 4) {
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.easeInEaseOut,
          duration: 300,
        })
        setSeeMoreBtnVisibility(true)
      }
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={onToggleExpand}
        onLongPress={() => handleLongPress(value as string)}
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
          ]}
        >
          {value}
        </JoloText>
        {seeMoreBtnVisible && !isExpanded && (
          <JoloText
            size={JoloTextSizes.mini}
            color={Colors.osloGray}
            customStyles={{ textAlign: 'right', marginTop: 5 }}
          >
            {t('Details.expandBtn')}
          </JoloText>
        )}
      </TouchableOpacity>
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

  const handleLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

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
                    <View style={styles.fieldContainer} onLayout={handleLayout}>
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
  test: 12,
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
