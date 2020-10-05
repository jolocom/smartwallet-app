import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import CollapsedScrollView from '~/components/CollapsedScrollView'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

const WINDOW = Dimensions.get('window')
const SCREEN_HEIGHT = WINDOW.height

interface Props {
  collapsedTitle: string
}

const FasWrapper: React.FC<Props> = ({ children, collapsedTitle }) => {
  return (
    <View style={styles.wrapper}>
      <CollapsedScrollView
        collapsedTitle={collapsedTitle}
        collapseStart={20}
        renderCollapsingComponent={() => (
          <IconWrapper
            customStyle={{
              marginTop: BP({ large: 35, medium: 35, small: 20, xsmall: 20 }),
            }}
          >
            <InteractionIcon />
          </IconWrapper>
        )}
      >
        {children}
      </CollapsedScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainBlack,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
  },
})

export default FasWrapper
