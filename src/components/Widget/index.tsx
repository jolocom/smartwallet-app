import React, { createContext, useContext, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Field, { TField } from './Field'
import Header, { THeader } from './Header'
import { useCustomContext } from '~/hooks/context'

interface IWidgetComposition {
  Field: TField
  Header: THeader
}

interface IProps {
  onAdd?: () => void
}

const WidgetContext = createContext<IProps | undefined>(undefined)

export const useWidget = useCustomContext(WidgetContext)

const Widget: React.FC<IProps> & IWidgetComposition = ({
  children,
  onAdd,
}) => {
  const contextValue = useMemo(
    () => ({
      onAdd,
    }),
    [onAdd],
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
    marginBottom: 10,
  },
})

Widget.Field = Field
Widget.Header = Header

export default Widget
