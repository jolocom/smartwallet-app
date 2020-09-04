import React from 'react'
import { Image, View, StyleSheet } from 'react-native'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { useRootSelector } from '~/hooks/useRootSelector'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { AuthorizationDetailsI } from '~/modules/interaction/types'

const Authorization = () => {
  const { imageURL } = useRootSelector<AuthorizationDetailsI>(
    getInteractionDetails,
  )

  return (
    <BasWrapper>
      {imageURL && (
        <View style={styles.imageWrapper}>
          <Image
            resizeMode="center"
            source={{ uri: imageURL }}
            style={styles.image}
          />
        </View>
      )}
    </BasWrapper>
  )
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
