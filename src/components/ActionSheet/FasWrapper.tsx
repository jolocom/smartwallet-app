import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import InteractionIcon, { IconWrapper } from './InteractionIcon'
import { Colors } from '~/utils/colors'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

interface Props {
  // NOTE: the string that will be shown by @CollapsedScrollView after it collapses. Usually
  //       it's the @title from the @InteractionHeader
  collapsedTitle: string
}

const FasWrapper: React.FC<Props> = ({ children, collapsedTitle }) => {
  return (
    <View style={styles.wrapper}>
      <CollapsedScrollView
        collapsedTitle={collapsedTitle}
        collapseStart={20}
        renderCollapsingComponent={() => (
          <IconWrapper customStyle={{ marginTop: 35 }}>
            <InteractionIcon />
          </IconWrapper>
        )}
      >
        <View style={{ paddingTop: 12 }}>{children}</View>
      </CollapsedScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainBlack,
  },
})

export default FasWrapper
