import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { reusedStyles } from './BasWrapper'

const BasWrapperContainer: React.FC = ({ children }) => {
  const { bottom } = useSafeArea()
  return (
    <View style={[reusedStyles.wrapper, { bottom: bottom + 5 }]}>
      {children}
    </View>
  )
}

export default BasWrapperContainer
