import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { IconToggle } from 'react-native-material-ui'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { StateVerificationSummary } from 'src/reducers/sso'
import Icon from 'react-native-vector-icons/Ionicons'

// TODO Self signed or not
// TODO Generic group component as opposed to view for flex grouping
// TODO Custom text component with size, font, color
// TODO Make whole card clickable as opposed to icon
// TODO Changes to the 'Container' custom component to allow horisontal flex
interface AttributeCardProps {
  onCheck: Function
  checked: boolean
  attributeValue: string
  attributeVerifications: StateVerificationSummary[]
}

export const AttributeCard : React.SFC<AttributeCardProps> = props => {

  // TODO For now we only look at the first verification on each attribute.
  const attributeValue = props.attributeValue.replace(',', ' ')
  const verification = props.attributeVerifications[0]
  const issuer = verification.selfSigned ? 'Self Signed' : `Issuer: ${verification.issuer.substring(0, 20)}...`

  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '3%',
      marginBottom: '3%'
    },
    attributeValue: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.headerFontSize,
      color: JolocomTheme.primaryColorBlack,
      fontWeight: '100'
    },
    issuerSection: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: 17,
      color: verification.selfSigned ? '#a0a0a3' : '#28a52d',
      marginTop: '2%',
      fontWeight: '100'
    }
  })

  const {checked, onCheck} = props

  return <View style={styles.cardContainer}>
    <View>
      <Text style={styles.attributeValue}> {attributeValue} </Text>
      <Text style={styles.issuerSection}> <Icon name='md-done-all' size={18} /> {issuer} </Text>
    </View>
    <IconToggle 
      name={checked ? 'check-circle': 'fiber-manual-record'} 
      onPress={() => onCheck(props.attributeValue)}
      color={checked ? JolocomTheme.primaryColorPurple : JolocomTheme.disabledButtonBackgroundGrey}
    />
  </View>
}
