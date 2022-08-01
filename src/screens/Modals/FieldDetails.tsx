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
import { ClaimMimeType } from '@jolocom/protocol-ts'
import useImagePrefetch from '~/hooks/useImagePrefetch'

const IMAGE_SIZE = BP({ large: 104, default: 90 })

type FieldValueProps = { value: string; mime_type: ClaimMimeType }

const FieldValue: React.FC<FieldValueProps> = ({ value, mime_type }) => {
  const [_, setClipboardData] = useClipboard()

  const { scheduleInfo } = useToasts()
  const { t } = useTranslation()

  const [numberOfVisibleLines, setNumberOfVisibleLines] = useState(5)
  const [seeMoreBtnVisible, setSeeMoreBtnVisibility] = useState(false)

  // FIXME: Some weird eslint issue here
  const isImageField = mime_type === ClaimMimeType.image_png

  const { isExpanded, onToggleExpand } = useToggleExpand({
    onExpand: () => {
      setNumberOfVisibleLines(0)
    },
    onCollapse: () => {
      setNumberOfVisibleLines(4)
    },
  })

  const handleLongPress = (value: string) => {
    setClipboardData(value)
    scheduleInfo({
      title: t('Toasts.copied'),
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
        onLongPress={() => handleLongPress(value)}
        activeOpacity={0.6}
        style={{ width: '100%' }}
      >
        {isImageField ? (
          <View
            style={{
              width: '100%',
              height: 200,
              paddingVertical: 16,
              paddingHorizontal: 44,
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: value }}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        ) : (
          <>
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
          </>
        )}
      </TouchableOpacity>
    </>
  )
}

const Icon = ({ url }: { url: string }) => {
  return (
    <View style={{ width: 40, height: 40, marginRight: 12 }}>
      <Image
        source={{ uri: url }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      />
    </View>
  )
}

const FieldDetails = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.FieldDetails>>()
  const {
    title,
    photo,
    fields,
    issuerIcon,
    contextIcons,
    backgroundColor = Colors.mainBlack,
  } = route.params

  const prefechedIcon = useImagePrefetch(issuerIcon)

  const handleLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

  const showIconContainer = issuerIcon || contextIcons

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
                    marginLeft: 12,
                  }}
                  numberOfLines={2}
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.middle}
                  color={Colors.white90}
                  weight={JoloTextWeight.medium}
                >
                  {title}
                </JoloText>
              </Collapsible.Title>
              {showIconContainer && (
                <View
                  style={{
                    paddingTop: 18,
                    paddingBottom: 24,
                    flexDirection: 'row',
                    marginLeft: 12,
                  }}
                >
                  {prefechedIcon && <Icon url={prefechedIcon} />}
                  {contextIcons &&
                    contextIcons.map((icon, i) => <Icon key={i} url={icon} />)}
                </View>
              )}
              {photo && (
                <View>
                  <Image source={{ uri: photo }} style={styles.photo} />
                </View>
              )}
              <Block
                customStyle={{
                  backgroundColor: Colors.white,
                  marginBottom: 16,
                }}
              >
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
                      <FieldValue
                        value={field.value as string}
                        mime_type={field.mime_type}
                      />
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
  photo: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    position: 'absolute',
    right: 12,
    bottom: 26,
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
