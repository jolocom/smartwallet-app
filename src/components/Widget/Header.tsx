import React from 'react'
import { StyleSheet, View } from 'react-native'
import HeaderAction from './HeaderAction'
import HeaderName from './HeaderName'
import { IHeaderComposition } from './types'

const Header: React.FC & IHeaderComposition = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
})

Header.Name = HeaderName
Header.Action = HeaderAction

export default Header
