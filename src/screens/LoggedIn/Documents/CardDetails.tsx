import React, { useState, useImperativeHandle } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import ActionSheet from '~/components/ActionSheet/ActionSheet'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Block from '~/components/Block'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import { IField } from '~/components/Card/types'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import Collapsible from '~/components/Collapsible'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { MainStackParamList } from '../Main'
import { ScreenNames } from '~/types/screens'

const IMAGE_SIZE = BP({ large: 100, default: 90 })

const CardDetails = () => {
  const navigation = useNavigation()
  const route = useRoute<
    RouteProp<MainStackParamList, ScreenNames.CardDetails>
  >()
  const { title, photo, fields } = route.params

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
                  <JoloText
                    color={Colors.black95}
                    numberOfLines={4}
                    customStyles={[
                      styles.fieldText,
                      { marginTop: BP({ default: 8, xsmall: 4 }) },
                    ]}
                  >
                    {field.value}
                  </JoloText>
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

export default CardDetails
