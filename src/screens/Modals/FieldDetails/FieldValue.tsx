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
import { PropertyMimeType } from '~/hooks/documents/types'
import { useToasts } from '~/hooks/toasts'
import { useToggleExpand } from '~/hooks/ui'
import useTranslation from '~/hooks/useTranslation'
import { TextLayoutEvent } from '~/types/props'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

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

const styles = StyleSheet.create({
  fieldText: {
    textAlign: 'left',
  },
})
