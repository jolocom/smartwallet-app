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
})

interface Props {
  title: string
  description?: string
  iconName: string
  payload?: JSX.Element
  isMarked?: boolean
}

const SettingsItem: React.SFC<Props> = ({
  payload,
  title,
  description,
  iconName,
  isMarked,
}: Props): JSX.Element => (
  <View style={[styles.card, isMarked && styles.yellowBg]}>
    <Icon
      style={{ marginRight: 18 }}
      size={24}
      name={iconName}
      color={isMarked ? 'white' : 'grey'}
    />
    <View>
      <Text
        style={[
          payload
            ? styles.headerTextWithPayload
            : styles.headerTextWithDescription,
          isMarked && styles.whiteText,
        ]}
      >
        {title}
      </Text>
      {payload ? (
        payload
      ) : (
        <Text style={[styles.description, isMarked && styles.whiteText]}>
          {description}
        </Text>
      )}
    </View>
  </View>
)

export default SettingsItem
