import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

const FasWrapper: React.FC = ({ children }) => {
  return (
    <View style={styles.wrapper}>
      <CollapsedScrollView
        collapsedTitle={'title'}
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
    justifyContent: 'space-between',
  },
})

export default FasWrapper
