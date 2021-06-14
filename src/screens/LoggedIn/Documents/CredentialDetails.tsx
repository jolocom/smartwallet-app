import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Block from '~/components/Block'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import Collapsible from '~/components/Collapsible'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { MainStackParamList } from '../Main'
import { ScreenNames } from '~/types/screens'
import { useToggleExpand } from '~/hooks/interface'

const IMAGE_SIZE = BP({ large: 100, default: 90 })

const CredentialDetails = () => {
  const navigation = useNavigation()
  const route =
    useRoute<RouteProp<MainStackParamList, ScreenNames.CredentialDetails>>()
  const { title, photo, fields } = route.params

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

  return (
    <Collapsible>
      <Collapsible.Header>
        <NavigationHeader
          type={NavHeaderType.Close}
          onPress={navigation.goBack}
        >
          <Collapsible.HeaderText>{title}</Collapsible.HeaderText>
        </NavigationHeader>
      </Collapsible.Header>
      <ScreenContainer>
        <Collapsible.ScrollView
          customStyles={{
            paddingBottom: 50,
          }}
        >
          <Collapsible.HidingTextContainer
            customStyles={[
              styles.titleContainer,
              {
                paddingRight: photo ? '40%' : 0,
                marginTop: 30,
              },
            ]}
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
          </Collapsible.HidingTextContainer>
          <Block customStyle={{ backgroundColor: Colors.white }}>
            {photo && <Image source={{ uri: photo }} style={styles.photo} />}
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
                {i !== Object.keys(fields).length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Block>
        </Collapsible.ScrollView>
      </ScreenContainer>
    </Collapsible>
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

export default CredentialDetails
