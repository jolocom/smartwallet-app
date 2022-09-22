import React, { useState, useRef } from 'react'
import {
  Image,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'

import JoloText from '~/components/JoloText'
import { PropertyMimeType, DocumentProperty } from '~/hooks/documents/types'
import { useToasts } from '~/hooks/toasts'
import { useToggleExpand } from '~/hooks/ui'
import useTranslation from '~/hooks/useTranslation'
import { TextLayoutEvent } from '~/types/props'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { PopOutIcon } from '~/assets/svg'
import { MdlPropertyKeys } from './types'

type FieldValueProps = { value: string; mime_type: PropertyMimeType }

export const FieldValue: React.FC<FieldValueProps> = ({ value, mime_type }) => {
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

export const handleLayout = () => {
  LayoutAnimation.configureNext({
    ...LayoutAnimation.Presets.linear,
    duration: 200,
  })
}

const MdlPopOutIcon = () => (
  <View style={styles.popOutIconContainer}>
    <PopOutIcon />
  </View>
)

export const renderField = (
  fields: DocumentProperty[],
  togglePrivileges?: () => void,
) => {
  return fields.map((field, i) => (
    <React.Fragment key={i}>
      <TouchableOpacity
        style={styles.fieldContainer}
        onLayout={handleLayout}
        onPress={
          field.key === MdlPropertyKeys.drivingPrivileges
            ? togglePrivileges
            : null
        }
        activeOpacity={0.6}
      >
        <JoloText
          customStyles={styles.fieldText}
          size={JoloTextSizes.mini}
          color={Colors.osloGray}
        >
          {field.label}
        </JoloText>
        <FieldValue value={field.value as string} mime_type={field.mime_type} />
        {field.key === MdlPropertyKeys.drivingPrivileges && <MdlPopOutIcon />}
      </TouchableOpacity>
      {i !== Object.keys(fields).length - 1 && <View style={styles.divider} />}
    </React.Fragment>
  ))
}

const styles = StyleSheet.create({
  fieldText: {
    textAlign: 'left',
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
  divider: {
    height: 1,
    backgroundColor: Colors.genevaGray,
    width: '100%',
    opacity: 0.15,
  },
  popOutIconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
})
