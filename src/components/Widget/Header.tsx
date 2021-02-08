import React from 'react'
import { StyleSheet, View } from 'react-native'
import HeaderAction, { THeaderAction } from './HeaderAction'
import HeaderName, { IHeaderNameProps } from './HeaderName'

export type THeader = IHeaderComposition & React.FC

interface IHeaderComposition {
  Name: React.FC<IHeaderNameProps>
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
    paddingVertical: 18,
  },
})

Header.Name = HeaderName
Header.Action = HeaderAction

export default Header
