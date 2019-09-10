import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Typography, Colors } from 'src/styles'

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  headerTextWithPayload: {
    ...Typography.baseFontStyles,
    color: Colors.blackMain,
    fontSize: Typography.textXS,
  },
  headerTextWithDescription: {
    ...Typography.baseFontStyles,
    color: Colors.blackMain,
    fontSize: Typography.textLG,
  },
  description: {
    ...Typography.baseFontStyles,
    color: Colors.blackMain,
    fontSize: Typography.textXS,
  },
  yellowBg: {
    backgroundColor: Colors.backUpWarningBg,
  },
  whiteText: {
    color: Colors.white,
  },
  disabledText: {
    color: Colors.greyLighter,
  },
})

interface Props {
  title: string
  description?: string
  iconName: string
  payload?: JSX.Element
  isHighlighted?: boolean
  isDisabled?: boolean
  onTouchEnd?: () => void
}

const SettingsItem: React.SFC<Props> = ({
  payload,
  title,
  description,
  iconName,
  isHighlighted,
  isDisabled,
  onTouchEnd,
}: Props): JSX.Element => (
  <View
    style={[styles.card, isHighlighted && styles.yellowBg]}
    onTouchEnd={!isDisabled ? onTouchEnd : undefined}
  >
    <Icon
      style={{ marginRight: 18 }}
      size={24}
      name={iconName}
      color={isHighlighted ? 'white' : 'grey'}
    />
    <View style={styles.textContainer}>
      <Text
        style={[
          payload
            ? styles.headerTextWithPayload
            : styles.headerTextWithDescription,
          isHighlighted && styles.whiteText,
          isDisabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
      {payload ? (
        payload
      ) : (
        <Text
          style={[
            styles.description,
            isHighlighted && styles.whiteText,
            isDisabled && styles.disabledText,
          ]}
        >
          {description}
        </Text>
      )}
    </View>
  </View>
)

export default SettingsItem
