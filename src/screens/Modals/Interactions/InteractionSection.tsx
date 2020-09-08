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
    <View>
      <Header color={Colors.white35} customStyles={styles.header}>
        {title}
      </Header>
      {children}
    </View>
  ) : null
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 27,
    textAlign: 'left',
  },
})

export default InteractionSection
