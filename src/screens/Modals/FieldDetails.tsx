import Clipboard from '@react-native-clipboard/clipboard'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useMemo, useRef, useState } from 'react'
import {
  Image,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { PopOutIcon } from '~/assets/svg'
import Block from '~/components/Block'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { useDocuments } from '~/hooks/documents'
import { PropertyMimeType } from '~/hooks/documents/types'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { useToggleExpand } from '~/hooks/ui'
import useImagePrefetch from '~/hooks/useImagePrefetch'
import useTranslation from '~/hooks/useTranslation'
import { getDocumentById } from '~/modules/credentials/selectors'
import { SpecialDocumentKeys } from '~/types/credentials'
import { TextLayoutEvent } from '~/types/props'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MainStackParamList } from '../LoggedIn/Main'
import useDrivingPrivileges from './DrivingPrivileges/hooks'
import { MdlPropertyKeys } from './DrivingPrivileges/types'

const IMAGE_SIZE = BP({ large: 104, default: 90 })
const ICON_SIZE = BP({ large: 40, default: 30 })

type DocumentFieldProps = {
  value: string
  mime_type: PropertyMimeType
  label?: string
  onPress?: () => void
  fieldKey?: string
}

export const DocumentField: React.FC<DocumentFieldProps> = ({
  value,
  mime_type,
  label,
  onPress = () => {},
  fieldKey,
}) => {
  const { scheduleSuccess } = useToasts()
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
    scheduleSuccess({
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

  const handleButtonLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

  const handlePress = () => {
    onPress ? onPress() : onToggleExpand()
  }

  return (
    <TouchableOpacity
      style={styles.fieldContainer}
      onLayout={handleButtonLayout}
      onLongPress={() => handleLongPress(value)}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <JoloText
        customStyles={styles.fieldText}
        size={JoloTextSizes.mini}
        color={Colors.osloGray}
      >
        {label}
      </JoloText>
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
            source={{ uri: `data:${mime_type};base64,${value}` }}
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
      {fieldKey === MdlPropertyKeys.drivingPrivileges && <MdlPopOutIcon />}
    </TouchableOpacity>
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
  const { id, backgroundColor = Colors.mainBlack } = route.params

  const document = useSelector(getDocumentById(id))!

  const redirect = useRedirect()

  const goBack = useGoBack()

  const { getHolderPhoto, getExtraProperties } = useDocuments()

  const fields = useMemo(
    () =>
      [...document.properties, ...getExtraProperties(document)].filter(
        (field) =>
          field.key !== SpecialDocumentKeys.photo &&
          field.key !== SpecialDocumentKeys.portrait,
      ),
    [document],
  )

  const prefechedIcon = useImagePrefetch(document.issuer.icon)

  const handleLayout = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }

  const { vehicleCategoryCodes } = useDrivingPrivileges(document)

  const holderPhoto = getHolderPhoto(document)

  const showIconContainer =
    Boolean(document.issuer.icon) ||
    Boolean(document.style.contextIcons?.length)

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
    redirect(ScreenNames.DrivingPrivileges, { id })
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
                    <DocumentField
                      value={
                        field.key === MdlPropertyKeys.drivingPrivileges
                          ? vehicleCategoryCodes
                          : (field.value as string)
                      }
                      label={field.label!}
                      onPress={
                        field.key === MdlPropertyKeys.drivingPrivileges
                          ? handlePressPrivileges
                          : undefined
                      }
                      fieldKey={field.key}
                      mime_type={field.mime_type}
                    />
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
