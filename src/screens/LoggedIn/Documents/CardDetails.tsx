import React from 'react'
import ActionSheet from '~/components/ActionSheet/ActionSheet'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { View, Image, StyleSheet, ScrollView } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import Block from '~/components/Block'
import { debugView } from '~/utils/dev'

interface Props {
  fields: Record<string, string>
  title: string
  image?: string
  isVisible: boolean
  onClose: () => void
}

const CardDetails: React.FC<Props> = ({
  fields,
  title,
  image,
  onClose,
  isVisible,
}) => {
  return (
    <ActionSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <NavigationHeader type={NavHeaderType.Close} onPress={onClose} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingBottom: 50 }}
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
              customStyles={styles.fieldText}
              kind={JoloTextKind.title}
              size={JoloTextSizes.middle}
            >
              {title}
            </JoloText>
          </View>
          <Block customStyle={{ backgroundColor: Colors.white }}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {Object.keys(fields).map((field, i) => (
              <React.Fragment key={i}>
                <View style={styles.fieldContainer}>
                  <JoloText
                    customStyles={styles.fieldText}
                    size={JoloTextSizes.mini}
                    color={Colors.osloGray}
                  >
                    {field}
                  </JoloText>
                  <JoloText
                    color={Colors.black95}
                    customStyles={[styles.fieldText, { marginTop: 8 }]}
                  >
                    {fields[field]}
                  </JoloText>
                </View>
                {i !== Object.keys(fields).length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Block>
        </ScrollView>
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
  },
  titleContainer: {
    paddingLeft: 6,
    paddingBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    right: 12,
    top: -70,
  },
  fieldContainer: {
    padding: 16,
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
