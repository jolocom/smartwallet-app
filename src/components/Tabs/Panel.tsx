import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTabs } from './context'

const Panel: React.FC = ({ children }) => {
  const { activeTab, activeSubtab } = useTabs()
  if (children && typeof children === 'function') {
    return (
      <View style={styles.container}>
        {children({ activeTab, activeSubtab })}
      </View>
    )
  }
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
})

export default Panel
