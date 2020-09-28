import React from 'react'
import { View } from 'react-native'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import useInteractionTitle from '~/screens/Modals/Interactions/hooks/useInteractionTitle'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import BP from '~/utils/breakpoints'

const FasWrapper: React.FC = ({ children }) => {
  const interactionTitle = useInteractionTitle()
  return (
    <CollapsedScrollView
      collapsedTitle={interactionTitle}
      collapseStart={20}
      renderCollapsingComponent={() => (
        <IconWrapper customStyle={{ marginBottom: 12, marginTop: 30 }}>
          <InteractionIcon />
        </IconWrapper>
      )}
    >
      <InteractionHeader />
      <View
        style={{
          marginTop: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
        }}
      >
        {children}
      </View>
    </CollapsedScrollView>
  )
}

export default FasWrapper
