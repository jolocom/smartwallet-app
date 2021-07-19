import React from 'react'
import { View, StyleSheet } from 'react-native'

import { HandAnimation } from '~/components/HandAnimation'
import ScreenHeader from '~/components/ScreenHeader'
import useTranslation from '~/hooks/useTranslation'

export const EntropyIntro: React.FC = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <HandAnimation />
      <View style={styles.textContainer}>
        <ScreenHeader
          title={t('Entropy.header')}
          subtitle={t('Entropy.subheader')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: '30%',
  },
})
