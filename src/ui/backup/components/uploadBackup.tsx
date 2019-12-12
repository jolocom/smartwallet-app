import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../../styles'
import React from 'react'
const loaders = require('react-native-indicator')

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 26,
    textAlign: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
    margin: 24,
  },
  waring: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
})
export const UploadBackup = () => (
  <React.Fragment>
    <Text style={styles.title}>{'Backing-up with Jolocom'}</Text>
    <View style={styles.loaderContainer}>
      <loaders.RippleLoader size={42} strokeWidth={2} color={Colors.beige} />
    </View>
    <Text style={styles.waring}>
      {
        'The process of secure synchronization of current data and configuration of auto-update function has started'
      }
    </Text>
  </React.Fragment>
)
