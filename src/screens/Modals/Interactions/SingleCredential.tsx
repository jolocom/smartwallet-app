import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'

interface PropsI {
  title: string
  description: string
  ctaText: string
}

const SingleCredential: React.FC<PropsI> = React.forwardRef(
  ({ title, description, ctaText, children }) => {
    return (
      <>
        <InteractionHeader title={title} description={description} />
        <View style={styles.body}>{children}</View>
        <InteractionFooter onSubmit={() => {}} ctaText={ctaText} />
      </>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.black,
  },
  body: {
    paddingVertical: 20,
  },
})

export default SingleCredential
