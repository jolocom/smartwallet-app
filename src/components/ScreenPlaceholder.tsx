import React from 'react'
import { View, StyleSheet } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'

interface Props {
  title: string
  description: string
}

const ScreenPlaceholder: React.FC<Props> = ({
  title,
  description,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <JoloText testID="title" kind={JoloTextKind.title}>
          {title}
        </JoloText>
        <JoloText
          testID="description"
          size={JoloTextSizes.mini}
          color={Colors.white50}
          weight={JoloTextWeight.regular}
          customStyles={{ marginVertical: 12, paddingHorizontal: 32 }}
        >
          {description}
        </JoloText>
      </View>
      {children}
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
