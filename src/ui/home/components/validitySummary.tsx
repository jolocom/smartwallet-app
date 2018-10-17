import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { compareDates } from 'src/lib/util'

interface Props {
  expiryDate: Date
}

const styles = StyleSheet.create({
  defaultContainerStyle: {
    flexDirection: 'row',
    flexBasis: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: '5%',
    marginBottom: '6%'
  } as ViewStyle,
  defaultLeftIconStyle: {
    paddingLeft: '5%',
    flex: 0.2
  }
})

export const ValiditySummary: React.SFC<Props> = props => {
  const color = checkValidity(props.expiryDate)

  return (
    <View style={styles.defaultContainerStyle}>
      <View style={styles.defaultLeftIconStyle}>
        <Icon size={15} name="check-all" color={color} />
      </View>
      <Text style={{color}} >{`Valid till ${props.expiryDate.toDateString()}`}</Text>
    </View>
  )
}

const checkValidity = (date: Date): string => {
  return compareDates(new Date(Date.now()), date) > 1 ? '#28a52d' : 'red'
}
