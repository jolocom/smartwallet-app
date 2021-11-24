import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
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

const IMAGE_SIZE = BP({ large: 100, default: 90 })

const FieldDetails = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.FieldDetails>>()
  const {
    title,
    photo,
    fields,
    backgroundColor = Colors.mainBlack,
  } = route.params

  const [expandedFieldIdx, setExpandedFieldIdx] = useState(-1)
  const { isExpanded, onToggleExpand } = useToggleExpand()
  const { scheduleInfo } = useToasts()
  const { t } = useTranslation()

  const [clipboardText, setClipboardData] = useClipboard()

  const handleToggleExpand = (idx: number) => {
    setExpandedFieldIdx(idx)
    onToggleExpand()
  }

  useEffect(() => {
    if (!isExpanded) {
      setExpandedFieldIdx(-1)
    }
  }, [isExpanded])

  const handleCopyToClipboard = setClipboardData

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

  const { top } = useSafeArea()
  return (
    <View
      style={{
        paddingTop: top,
        backgroundColor,
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
            <Collapsible.Scroll
              disableScrollViewPanResponder
              containerStyles={{ height: '100%' }}
            >
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
                      <TouchableOpacity
                        onPress={() => handleToggleExpand(i)}
                        onLongPress={() =>
                          handleCopyToClipboard(field.value as string)
                        }
                        activeOpacity={0.6}
                      >
                        <JoloText
                          color={Colors.black95}
                          numberOfLines={
                            isExpanded && expandedFieldIdx === i ? 0 : 4
                          }
                          customStyles={[
                            styles.fieldText,
                            { marginTop: BP({ default: 8, xsmall: 4 }) },
                          ]}
                        >
                          {field.value}
                        </JoloText>
                      </TouchableOpacity>
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
