import { useSelector } from 'react-redux'
import React from 'react'
import { Image, View, StyleSheet } from 'react-native'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { getAuthorizationDetails } from '~/modules/interaction/selectors'

const Authorization = () => {
  const { imageURL } = useSelector(getAuthorizationDetails)

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
