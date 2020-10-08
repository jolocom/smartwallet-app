import React from 'react'
import { NavigationProp } from '@react-navigation/native'

import Btn from '~/components/Btn'
import ScreenContainer from '~/components/ScreenContainer'
import useRedirectTo from '~/hooks/useRedirectTo'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'

interface PropsI {
  navigation: NavigationProp<{}>
}

const PinRecoveryInstructions: React.FC<PropsI> = ({ navigation }) => {
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery)
  return (
    <ScreenContainer>
      <Btn onPress={redirectToRecovery}>{strings.RESTORE_ACCESS}</Btn>
    </ScreenContainer>
  )
}

export default PinRecoveryInstructions
