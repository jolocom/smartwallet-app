import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../../styles'
import React from 'react'

const loaders = require('react-native-indicator')

interface Props {
  isLoading: boolean
  onCancel: () => void
  onAgree: () => void
}
const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 26,
  },
  info: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 8,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  buttonSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 10,
    color: Colors.white,
    fontSize: 18,
  },
})
export const DeleteConsent: React.FC<Props> = ({
  isLoading,
  onCancel,
  onAgree,
}) => (
  <React.Fragment>
    <Text style={styles.title}>{'Disable auto-backup'}</Text>
    {isLoading ? (
      <View style={styles.loaderContainer}>
        <loaders.RippleLoader size={42} strokeWidth={2} color={Colors.beige} />
      </View>
    ) : (
      <React.Fragment>
        <Text style={styles.info}>
          {
            'By disabling this function you will erase all information from our server'
          }
        </Text>
        <View style={styles.buttonSection}>
          <Text style={styles.button} onPress={onCancel}>
            {'Cancel'}
          </Text>
          <Text style={styles.button} onPress={onAgree}>
            {'Agree'}
          </Text>
        </View>
      </React.Fragment>
    )}
  </React.Fragment>
)
