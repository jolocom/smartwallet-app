import React, { createContext, useContext, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { debugView } from '~/utils/dev'
import Field, { TField } from './Field'
import Header, { THeader } from './Header'

interface IWidgetComposition {
  Field: TField
  Header: THeader
}

interface IProps {
  onCreate: () => void
}

const WidgetContext = createContext<IProps>({
  onCreate: () => {},
})

// TODO: use useCustomContext instead
export const useWidget = () => useContext(WidgetContext)

const Widget: React.FC<IProps> & IWidgetComposition = ({
  children,
  onCreate,
}) => {
  const contextValue = useMemo(
    () => ({
      onCreate,
    }),
    [],
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
    // ...debugView(),
  },
})

Widget.Field = Field
Widget.Header = Header

export default Widget
