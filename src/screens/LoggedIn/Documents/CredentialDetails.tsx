import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Block from '~/components/Block'
import Collapsible from '~/components/Collapsible'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { useToggleExpand } from '~/hooks/ui'
import { getDocumentById } from '~/modules/credentials/selectors'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { MainStackParamList } from '../Main'

const IMAGE_SIZE = BP({ large: 100, default: 90 })

const CredentialDetails = () => {
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.FieldDetails>>()
  const { id } = route.params
  const document = useSelector(getDocumentById(id))

  if (!document) {
    throw new Error('CredentialDetails: Document not found')
  }

  const [expandedFieldIdx, setExpandedFieldIdx] = useState(-1)
  const { isExpanded, onToggleExpand } = useToggleExpand()

  const handleToggleExpand = (idx: number) => {
    setExpandedFieldIdx(idx)
    onToggleExpand()
  }

  useEffect(() => {
    if (!isExpanded) {
      setExpandedFieldIdx(-1)
    }
  }, [isExpanded])

  const { top } = useSafeArea()
  return (
    <View style={{ paddingTop: top }}>
      <Collapsible
        renderHeader={() => <Collapsible.Header type={NavHeaderType.Close} />}
        renderScroll={() => (
          <ScreenContainer.Padding>
            <Collapsible.Scroll>
              <Collapsible.Title
                text={document.name}
                customContainerStyles={{
                  width: document.photo ? '68%' : '100%',
                  ...(document.photo && { marginTop: 30 }),
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
                  {document.name}
                </JoloText>
              </Collapsible.Title>
              <Block customStyles={{ backgroundColor: Colors.white }}>
                {document.photo && (
                  <Image
                    source={{ uri: document.photo }}
                    style={styles.photo}
                  />
                )}
                {document.properties.map((field, i) => (
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
                        activeOpacity={1}
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
                    {i !== Object.keys(document.properties).length - 1 && (
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

export default CredentialDetails
