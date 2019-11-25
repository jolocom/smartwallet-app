import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { styles } from '../styles'
import { BackIconIntermediary, CrossIconIntermediary } from '../../../resources'

interface Props {
  onNavigation: () => void
  isBackButton: boolean
}

export const NavigationSection = (props: Props) => {
  const { onNavigation, isBackButton } = props
  return (
    <View
      style={{
        ...styles.navigationWrapper,
      }}
    >
      {isBackButton ? (
        <TouchableOpacity
          onPress={onNavigation}
          activeOpacity={0.8}
          style={styles.navigationButton}
        >
          <BackIconIntermediary />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {!isBackButton ? (
        <TouchableOpacity
          onPress={onNavigation}
          activeOpacity={0.8}
          style={styles.navigationButton}
        >
          <CrossIconIntermediary />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  )
}
