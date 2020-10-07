import { useSelector } from 'react-redux'
import React from 'react'
import { Image, View, StyleSheet } from 'react-native'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import {
  getAuthorizationDetails,
  getCounterpartyName,
} from '~/modules/interaction/selectors'
import InteractionHeader from './InteractionHeader'
import { strings } from '~/translations/strings'
import InteractionFooter from './InteractionFooter'
import useAuthzSubmit from '~/hooks/interactions/useAuthzSubmit'
import { truncateFirstWord, capitalizeWord } from '~/utils/stringUtils'

const Authorization = () => {
  const { imageURL, action } = useSelector(getAuthorizationDetails)
  const serviceName = useSelector(getCounterpartyName)
  const description = strings.SERVICE_IS_NOW_READY_TO_GRANT_YOU_ACCESS(
    serviceName,
  )
  const title = strings.WOULD_YOU_LIKE_TO_ACTION(action)
  const ctaWord = action ? truncateFirstWord(action) : strings.AUTHORIZE
  const cta = capitalizeWord(ctaWord)

  const handleSubmit = useAuthzSubmit()

  return (
    <BasWrapper>
      <InteractionHeader {...{ title, description }} />
      {imageURL && (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageURL }}
            style={styles.image}
            // NOTE: it will take max Dimension size (260 - width) and make height
            // based on the aspect ration of actual image size
            resizeMode="cover"
          />
        </View>
      )}
      <InteractionFooter cta={cta} onSubmit={handleSubmit} />
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
