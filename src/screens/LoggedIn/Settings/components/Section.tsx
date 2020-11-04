import React from 'react'
import { StyleSheet, View } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface PropsI {
  title: string
}

const Section: React.FC<PropsI> = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <JoloText
      kind={JoloTextKind.title}
      size={JoloTextSizes.middle}
      weight={JoloTextWeight.regular}
      customStyles={{
        marginBottom: BP({ large: 40, medium: 40, default: 20 }),
      }}
    >
      {title}
    </JoloText>
    <View style={styles.sectionOptionContainer}>{children}</View>
  </View>
)

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: 'flex-start',
    marginBottom: 44,
    alignItems: 'flex-start',
    width: '100%',
  },
  sectionOptionContainer: {
    backgroundColor: Colors.haiti,
    elevation: 15,
    width: '100%',
    borderRadius: 8,
  },
})

export default Section
