import React from 'react'
import { StyleSheet } from 'react-native'

import { Colors } from '~/utils/colors'
import CollapsedScrollView from '~/components/CollapsedScrollView'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'
import useInteractionTitle from '~/screens/Modals/Interactions/hooks/useInteractionTitle'

import InteractionIcon, { IconWrapper } from './InteractionIcon'

const FasWrapper: React.FC<{ onSubmit: () => void }> = ({
  children,
  onSubmit,
}) => {
  const interactionTitle = useInteractionTitle()
  return (
    <>
      <CollapsedScrollView
        collapsedTitle={interactionTitle}
        collapseStart={40}
        renderCollapsingComponent={() => (
          <IconWrapper customStyle={{ marginVertical: 12 }}>
            <InteractionIcon />
          </IconWrapper>
        )}
      >
        <InteractionHeader />
        {children}
      </CollapsedScrollView>
      <InteractionFooter onSubmit={onSubmit} />
    </>
  )
}

export default FasWrapper
