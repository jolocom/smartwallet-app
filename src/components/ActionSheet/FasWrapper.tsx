import React from 'react'
import { View } from 'react-native'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'
import useInteractionTitle from '~/screens/Modals/Interactions/hooks/useInteractionTitle'

import InteractionIcon, { IconWrapper } from './InteractionIcon'

const FasWrapper: React.FC = ({ children }) => {
  const interactionTitle = useInteractionTitle()
  return (
    <>
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
        <View style={{ paddingTop: 32 }}>{children}</View>
      </CollapsedScrollView>
      <InteractionFooter />
    </>
  )
}

export default FasWrapper
