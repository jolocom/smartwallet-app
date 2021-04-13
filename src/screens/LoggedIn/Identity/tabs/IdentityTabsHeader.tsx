import React from 'react'
import { View, StyleSheet } from 'react-native'
import BP from '~/utils/breakpoints'

// NOTE: ATM it's a simple view wrapper. In case more tabs are added, can
// become a horizontal scrollview.

const IdentityTabsHeader: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: BP({ small: 28, medium: 28, default: 36 }),
    paddingHorizontal: '5%',
  },
})

export default IdentityTabsHeader
