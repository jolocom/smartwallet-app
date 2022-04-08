import React from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import JoloText from '~/components/JoloText'
import { useGoBack } from '~/hooks/navigation'

const PrivacyPolicy = () => {
  const goBack = useGoBack()
  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: 0,
      }}
    >
      <NavigationHeader type={NavHeaderType.Back} onPress={goBack}>
        <JoloText>Privacy Policy</JoloText>
      </NavigationHeader>
    </ScreenContainer>
  )
}

export default PrivacyPolicy
