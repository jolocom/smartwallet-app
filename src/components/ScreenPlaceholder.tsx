import React from 'react'
import { View, StyleSheet } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface Props {
  title: string
  description: string
}

const ScreenPlaceholder: React.FC<Props> = ({ title, description }) => {
  return (
    <View style={styles.container}>
      <JoloText kind={JoloTextKind.title}>{title}</JoloText>
      <JoloText
        size={JoloTextSizes.mini}
        color={Colors.white50}
        weight={JoloTextWeight.regular}
        customStyles={{ marginTop: 12, paddingHorizontal: 32 }}
      >
        {description}
      </JoloText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20%',
  },
})

export default ScreenPlaceholder
