import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import LeftArrow from '~/components/LeftArrow'
import { useNavigation } from '@react-navigation/native'

const SingleSettingView: React.FC = ({ children }) => {
  const navigation = useNavigation()

  return (
    <ScreenContainer>
      <LeftArrow handlePress={navigation.goBack} />
      {children}
    </ScreenContainer>
  )
}

export default SingleSettingView
