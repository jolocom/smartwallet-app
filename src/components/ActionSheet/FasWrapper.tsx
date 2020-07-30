import React from 'react'
import { View } from 'react-native'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'

const FasWrapper: React.FC<{ onSubmit: () => void }> = ({
  children,
  onSubmit,
}) => {
  return (
    <>
      <IconWrapper customStyle={{ marginVertical: 12 }}>
        <InteractionIcon />
      </IconWrapper>
      <InteractionHeader />
      <View style={{ flex: 1 }}>{children}</View>
      <InteractionFooter onSubmit={onSubmit} />
    </>
  )
}

export default FasWrapper
