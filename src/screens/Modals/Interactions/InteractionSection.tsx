import React from 'react'
import Header from '~/components/Header'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'

interface Props {
  title: string
  visible: boolean
}

const InteractionSection: React.FC<Props> = ({ title, visible, children }) => {
  return visible ? (
    <View style={styles.wrapper}>
      <Header color={Colors.white35} customStyles={{ textAlign: 'left' }}>
        {title}
      </Header>
      {children}
    </View>
  ) : null
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 27,
  },
})

export default InteractionSection
