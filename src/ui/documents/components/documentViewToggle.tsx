import React from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Typography } from 'src/styles'

export interface DocumentViewToggleProps {
  showingValid: boolean
  onTouch: () => void
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  bar: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    borderRadius: 4,
  },
  barValid: {
    backgroundColor: Colors.greenFaded060,
  },
  barExpired: {
    backgroundColor: Colors.sand025,
  },
  icon: {
    color: Colors.blackMain050,
    marginRight: 8,
  },
  text: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    color: Colors.blackMain050,
  },
  underline: {
    textDecorationLine: 'underline',
  },
})

export const DocumentViewToggle: React.SFC<DocumentViewToggleProps> = (
  props,
): JSX.Element => (
  <TouchableWithoutFeedback onPress={props.onTouch}>
    <View style={styles.container}>
      {props.showingValid ? (
        <View style={[styles.bar, styles.barValid]}>
          <Icon style={styles.icon} size={17} name="check-all" />
          <Text style={styles.text}>
            Showing valid.{' '}
            <Text style={styles.underline}>Tap to show expired.</Text>
          </Text>
        </View>
      ) : (
        <View style={[styles.bar, styles.barExpired]}>
          <Icon style={styles.icon} size={17} name="alert-circle-outline" />
          <Text style={styles.text}>
            Showing expired.{' '}
            <Text style={styles.underline}>Tap to show valid.</Text>
          </Text>
        </View>
      )}
    </View>
  </TouchableWithoutFeedback>
)
