import React, { ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'

// TODO Self signed or not
// TODO Generic group component as opposed to view for flex grouping
// TODO Custom text component with size, font, color
// TODO Make whole card clickable as opposed to icon
// TODO Changes to the 'Container' custom component to allow horisontal flex
interface AttributeCardProps {
  rightIcon?: ReactNode
  secondaryText?: string
  primaryText: string
}

export const ClaimCard: React.SFC<AttributeCardProps> = props => {
  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3%'
    },
    primaryText: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.headerFontSize,
      color: JolocomTheme.primaryColorBlack,
      fontWeight: '100'
    },
    secondaryText: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: 17,
      color: '#05050d',
      opacity: 0.4
    }
  })

  const { primaryText, secondaryText, rightIcon } = props
  return (
    <View style={styles.cardContainer}>
      <View>
        {secondaryText ? <Text style={styles.secondaryText}> {secondaryText} </Text> : null}
        <Text style={styles.primaryText}> {primaryText} </Text>
      </View>
      {rightIcon}
    </View>
  )
}
