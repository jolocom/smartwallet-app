import React from 'react'
import { View, LayoutChangeEvent } from 'react-native'

import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'

/* NOTE:
 * The @HidingTextContainer must be a direct child of the @Collapsible.ScrollView
 * (or any other @Collapsible list component that accepts it as a child).
 * This is done to assure the calculations of the distances are right. Does not
 * apply to @Collapsible.FlatList, since the @HidingTextContainer is passes as a
 * child, but rather as a prop.
 *
 */

const HidingTextContainer: ICollapsibleComposite['HidingTextContainer'] = ({
  children,
  customStyles = {},
}) => {
  const { setDistanceToText, setHidingTextHeight } = useCollapsible()

  const handleLayout = (e: LayoutChangeEvent) => {
    setDistanceToText(e.nativeEvent.layout.y)
    setHidingTextHeight(e.nativeEvent.layout.height)
  }
  return (
    <View style={[customStyles]} onLayout={handleLayout}>
      {children}
    </View>
  )
}

HidingTextContainer.displayName = 'HidingTextContainer'

export { HidingTextContainer }
