import React from 'react'
import { Image, View, StyleSheet } from 'react-native'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { useRootSelector } from '~/hooks/useRootSelector'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { isAuthzDetails } from '~/modules/interaction/guards'

const Authorization = () => {
  const details = useRootSelector(getInteractionDetails)
  if (isAuthzDetails(details)) {
    const { imageURL } = details
    return (
      <BasWrapper>
        {imageURL && (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageURL }}
              style={styles.image}
              resizeMode="cover" // it will take max Dimension size (260 - width) and make height based on the aspect ration of actual image size
            />
          </View>
        )}
      </BasWrapper>
    )
  }
  return null
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 260,
    height: 230,
  },
})

export default Authorization
