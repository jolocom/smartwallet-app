import React, { createContext, useContext, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { AttrKeys } from '~/types/credentials'
import Field, { TField } from './Field'
import Header, { THeader } from './Header'

interface IWidgetComposition {
  Field: TField
  Header: THeader
}

interface IProps {
  onCreate: (attrKey: AttrKeys) => void
  onSelect?: (...attrs: any) => void
  name: AttrKeys
}

const WidgetContext = createContext<IProps | undefined>(undefined)

// TODO: use useCustomContext instead
export const useWidget = () => useContext(WidgetContext)

const Widget: React.FC<IProps> & IWidgetComposition = ({
  children,
  onCreate,
  onSelect,
  name,
}) => {
  const contextValue = useMemo(
    () => ({
      onCreate,
      onSelect,
      name,
    }),
    [onCreate, onSelect, name],
  )
  return (
    <WidgetContext.Provider value={contextValue}>
      <View style={styles.container} children={children} />
    </WidgetContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})

Widget.Field = Field
Widget.Header = Header

export default Widget
