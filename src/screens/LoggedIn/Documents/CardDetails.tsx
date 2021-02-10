import React, { useState, useImperativeHandle } from 'react'
import { View, Image, StyleSheet, ScrollView } from 'react-native'

import ActionSheet from '~/components/ActionSheet/ActionSheet'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Block from '~/components/Block'
import BP from '~/utils/breakpoints'
import ScreenContainer from '~/components/ScreenContainer'
import { IField } from '~/components/Card/types'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'

interface Props {
  fields: IField[]
  title?: string
  image?: string
}

const IMAGE_SIZE = BP({ large: 100, default: 90 })

const CardDetails = React.forwardRef<{ show: () => void }, Props>(
  ({ fields, title, image }, ref) => {
    const [modalVisible, setModalVisible] = useState(false)

    const handleClose = () => setModalVisible(false)

    useImperativeHandle(ref, () => ({
      show: () => setModalVisible(true),
    }))

    return (
      <ActionSheet isVisible={modalVisible} onClose={handleClose}>
        <ScreenContainer
          isFullscreen
          customStyles={{ paddingHorizontal: '5%' }}
        >
          <NavigationHeader type={NavHeaderType.Close} onPress={handleClose} customStyles={{paddingHorizontal: 0}} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            style={{ width: '100%' }}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
          >
            <View
              style={[
                styles.titleContainer,
                {
                  paddingRight: image ? '40%' : 0,
                },
              ]}
            >
              <JoloText
                customStyles={{...styles.fieldText, lineHeight: BP({ xsmall: 24, default: 28 })}}
                kind={JoloTextKind.title}
                size={JoloTextSizes.middle}
                color={Colors.white90}
                weight={JoloTextWeight.regular}
                
              >
                {title}
              </JoloText>
            </View>
            <Block customStyle={{ backgroundColor: Colors.white }}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
              {fields.map((field, i) => (
                <React.Fragment key={i}>
                  <View style={styles.fieldContainer}>
                    <JoloText
                      customStyles={styles.fieldText}
                      size={JoloTextSizes.mini}
                      color={Colors.osloGray}
                    >
                      {field.name}
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
          </ScrollView>
        </ScreenContainer>
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
  },
  titleContainer: {
    paddingLeft: 6,
    paddingBottom: BP({ default: 12, xsmall: 8 }),
  },
  image: {
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
