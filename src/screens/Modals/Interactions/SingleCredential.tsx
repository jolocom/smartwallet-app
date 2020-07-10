import React from 'react'

import InteractionHeader from './InteractionHeader'
import InteractionFooter from './InteractionFooter'
import { View, StyleSheet } from 'react-native'

interface PropsI {
  title: string
  description?: string
  onSubmit: () => void
}

const SingleCredential: React.FC<PropsI> = ({
  title,
  description,
  children,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <InteractionHeader title={title} />
      {children}
      <InteractionFooter onSubmit={onSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default SingleCredential
