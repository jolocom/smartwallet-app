import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind } from '~/components/JoloText'

interface Props {
  title: string
}

const InteractionSection: React.FC<Props> = ({ title, children }) => {
  return (
    <View style={styles.wrapper}>
      <JoloText
        kind={JoloTextKind.title}
        size="middle"
        color={Colors.white35}
        customStyles={{ textAlign: 'left' }}
      >
        {title}
      </JoloText>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 27,
  },
})

export default InteractionSection
