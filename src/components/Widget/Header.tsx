import React from 'react'
import { StyleSheet, View } from 'react-native'
import HeaderAction, { THeaderAction } from './HeaderAction'
import HeaderName from './HeaderName'

export type THeader = IHeaderComposition & React.FC

interface IHeaderComposition {
  Name: React.FC
  Action: THeaderAction
}

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
    marginTop: -10,
    marginBottom: -5,
  },
})

Header.Name = HeaderName
Header.Action = HeaderAction

export default Header
