import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Field from './Field'
import Header from './Header'
import { IWidgetComposition, IWidgetProps } from './types'
import { WidgetContext } from './context'

const Widget: React.FC<IWidgetProps> & IWidgetComposition = ({
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
      <View style={styles.container} children={children} testID="widget" />
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
