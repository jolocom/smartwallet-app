import React from 'react'
import { StyleSheet, View } from 'react-native'

import InteractionHeader from './InteractionHeader'
import InteractionFooter from './InteractionFooter'

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
      <InteractionHeader title={title} description={description} />
      <View style={styles.body}>{children}</View>
      <InteractionFooter onSubmit={onSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  body: {
    paddingVertical: 20,
  },
})

export default SingleCredential
