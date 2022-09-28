import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useState, useRef } from 'react'
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Block from '~/components/Block'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { useDocuments } from '~/hooks/documents'
import useImagePrefetch from '~/hooks/useImagePrefetch'
import { getDocumentById } from '~/modules/credentials/selectors'
import { TextLayoutEvent } from '~/types/props'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MainStackParamList } from '../LoggedIn/Main'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import Clipboard from '@react-native-clipboard/clipboard'
import { PropertyMimeType } from '~/hooks/documents/types'
import { useToasts } from '~/hooks/toasts'
import { useToggleExpand } from '~/hooks/ui'
import useTranslation from '~/hooks/useTranslation'
import { PopOutIcon } from '~/assets/svg'
import { MdlPropertyKeys } from './DrivingPrivileges/types'

const IMAGE_SIZE = BP({ large: 104, default: 90 })
const ICON_SIZE = BP({ large: 40, default: 30 })

type FieldValueProps = { value: string; mime_type: PropertyMimeType }

const FieldValue: React.FC<FieldValueProps> = ({ value, mime_type }) => {
  const { scheduleInfo } = useToasts()
  const { t } = useTranslation()

  const [numberOfVisibleLines, setNumberOfVisibleLines] = useState(5)
  const [seeMoreBtnVisible, setSeeMoreBtnVisibility] = useState(false)

  const isImageField = mime_type === PropertyMimeType.image_png

  const { isExpanded, onToggleExpand } = useToggleExpand({
    onExpand: () => {
      setNumberOfVisibleLines(0)
    },
    onCollapse: () => {
      setNumberOfVisibleLines(4)
    },
  })

  const handleLongPress = (value: string) => {
    Clipboard.setString(value)
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

const MdlPopOutIcon = () => (
  <View style={styles.popOutIconContainer}>
    <PopOutIcon />
  </View>
)

export const Icon = ({ url }: { url: string }) => {
  return (
    <View
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginRight: 12,
      }}
    >
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
  const { t } = useTranslation()
  const { id, backgroundColor = Colors.mainBlack } = route.params

  const document = useSelector(getDocumentById(id))!

  const redirect = useRedirect()

  const goBack = useGoBack()

  const { getHolderPhoto, getExtraProperties } = useDocuments()

  const fields = [...document.properties, ...getExtraProperties(document)]

  const prefechedIcon = useImagePrefetch(document.issuer.icon)

  const handleLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

  const holderPhoto = getHolderPhoto(document)

  const showIconContainer =
    Boolean(document.issuer.icon) || Boolean(document.issuer.icon?.length)

  const { top } = useSafeArea()

  const getDocumentNameContainerHeight = () => {
    if (!showIconContainer && holderPhoto) {
      return IMAGE_SIZE
    } else if (showIconContainer && holderPhoto) {
      return IMAGE_SIZE - ICON_SIZE
    } else {
      return 'auto'
    }
  }

  const handlePressPrivileges = () => {
    redirect(ScreenNames.DrivingPrivileges, {
      title: 'Driving Privileges',
      icons: [document.issuer.icon],
      portrait: holderPhoto,
      containerHeight: getDocumentNameContainerHeight(),
      prefechedIcon,
      document,
    })
  }

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
            onPress={goBack}
          />
        )}
        renderScroll={() => (
          <ScreenContainer.Padding>
            {/* TODO figure out how scroll to the top in the MDLPrivileges*/}
            <Collapsible.Scroll disableScrollViewPanResponder>
              <Collapsible.Title
                text={document.name}
                customContainerStyles={{
                  width: holderPhoto ? '68%' : '100%',
                  marginTop: holderPhoto && showIconContainer ? 6 : 0,
                }}
              >
                <View
                  style={{
                    height: getDocumentNameContainerHeight(),
                    justifyContent: !showIconContainer
                      ? 'center'
                      : 'flex-start',
                  }}
                >
                  <JoloText
                    customStyles={{
                      ...styles.documentNameContainer,
                      lineHeight: BP({ xsmall: 24, default: 26 }),
                      marginLeft: 12,
                    }}
                    numberOfLines={2}
                    kind={JoloTextKind.title}
                    size={JoloTextSizes.middle}
                    color={Colors.white90}
                    weight={JoloTextWeight.medium}
                  >
                    {document.name}
                  </JoloText>
                </View>
              </Collapsible.Title>
              {showIconContainer && (
                <View
                  style={{
                    ...styles.iconContainer,
                    paddingTop: !holderPhoto ? 8 : 0,
                  }}
                >
                  {prefechedIcon && <Icon url={prefechedIcon} />}
                  {document.style.contextIcons &&
                    document.style.contextIcons.map((icon, i) => (
                      <Icon key={i} url={icon} />
                    ))}
                </View>
              )}
              {holderPhoto && (
                <View>
                  <Image source={{ uri: holderPhoto }} style={styles.photo} />
                </View>
              )}
              <Block
                customStyles={{
                  backgroundColor: Colors.white,
                  marginBottom: 16,
                  marginTop: 16,
                }}
              >
                {fields.map((field, i) => (
                  <React.Fragment key={i}>
                    <TouchableOpacity
                      style={styles.fieldContainer}
                      onLayout={handleLayout}
                      activeOpacity={0.6}
                      onPress={
                        field.key === MdlPropertyKeys.drivingPrivileges
                          ? handlePressPrivileges
                          : null
                      }
                    >
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
                      {field.key === MdlPropertyKeys.drivingPrivileges && (
                        <MdlPopOutIcon />
                      )}
                    </TouchableOpacity>
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
    bottom: 0,
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
  documentNameContainer: {
    textAlign: 'left',
    display: 'flex',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.genevaGray,
    width: '100%',
    opacity: 0.15,
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  popOutIconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
})

export default FieldDetails
