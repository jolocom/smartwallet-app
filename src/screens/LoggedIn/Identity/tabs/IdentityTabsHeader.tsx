import React from 'react'
import { View, StyleSheet } from 'react-native'

import { debugView } from '~/utils/dev'

// NOTE: ATM it's a simple view wrapper. In case more tabs are added, can
// become a horizontal scrollview.

const IdentityTabsHeader: React.FC = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 36,
  },
})

export default IdentityTabsHeader
