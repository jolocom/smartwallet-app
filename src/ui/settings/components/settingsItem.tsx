import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { JolocomTheme } from '../../../styles/jolocom-theme.android'

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
  },
  headerTextWithPayload: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
  },
  headerTextWithDescription: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
    fontSize: 22,
  },
  description: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
  },
  yellowBg: {
    backgroundColor: '#f1a107',
  },
  whiteText: {
    color: JolocomTheme.primaryColorWhite,
  },
  disabledText: {
    color: '#9b9b9e',
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
