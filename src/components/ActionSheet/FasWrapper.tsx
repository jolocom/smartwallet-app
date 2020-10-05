import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import CollapsedScrollView from '~/components/CollapsedScrollView'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { debugView } from '~/utils/dev'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

interface Props {
  collapsedTitle: string
}

const FasWrapper: React.FC<Props> = ({ children, collapsedTitle }) => {
  return (
    // <CollapsedScrollView
    //   collapsedTitle={interactionTitle}
    //   collapseStart={20}
    //   renderCollapsingComponent={() => (
    //     <IconWrapper customStyle={{ marginBottom: 12, marginTop: 30 }}>
    //       <InteractionIcon />
    //     </IconWrapper>
    //   )}
    // >
    //   <InteractionHeader />
    //   <View
    //     style={{
    //       marginTop: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
    //     }}
    //   >
    //     {children}
    //   </View>
    // </CollapsedScrollView>
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
        <View
          style={{
            paddingTop: 12,
            marginTop: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
          }}
        >
          {children}
        </View>
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
