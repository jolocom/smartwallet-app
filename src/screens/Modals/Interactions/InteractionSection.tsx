import React from 'react'
import Header from '~/components/Header'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'

interface Props {
  title: string
}

const InteractionSection: React.FC<Props> = ({ title, children }) => {
  return (
    <View style={styles.wrapper}>
      <Header color={Colors.white35} customStyles={{ textAlign: 'left' }}>
        {title}
      </Header>
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
