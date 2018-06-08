import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { IconToggle } from 'react-native-material-ui'
import { JolocomTheme } from 'src/styles/jolocom-theme'

// TODO Self signed or not
// TODO Generic group component as opposed to view for flex grouping
// TODO Custom text component with size, font, color
// TODO Make whole card clickable as opposed to icon
// TODO Changes to the 'Container' custom component to allow horisontal flex
interface AttributeCardProps {
  onCheck: Function
  checked: boolean
  attributeValue: string
}

export const AttributeCard : React.SFC<AttributeCardProps> = props => {
  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '3%',
      marginBottom: '3%'
    },
    attributeValue: {
      fontSize: JolocomTheme.headerFontSize,
      color: JolocomTheme.primaryColorBlack,
      fontWeight: '100'
    }
  })

  return <View style={styles.cardContainer}>
    <View>
      <Text style={styles.attributeValue}> {props.attributeValue} </Text>
      <Text> Self Signed </Text>
    </View>
    <IconToggle 
      name={props.checked ? 'check-circle': 'fiber-manual-record'} 
      onPress={() => props.onCheck(props.attributeValue)}
      color={props.checked ? JolocomTheme.primaryColorPurple : JolocomTheme.disabledButtonBackgroundGrey}
    />
  </View>
}
