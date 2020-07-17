import React from 'react'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useLoader } from '~/hooks/useLoader'
import AttributesWidget from '~/components/AttributesWidget'

const attributes = {
  name: ['Sveta Buben', 'sbub'],
  email: ['sveta@jolocom.com'],
}

const ContainerComponent: React.FC = ({ children }) => {
  return <View style={{ width: '100%' }}>{children}</View>
}

const Claims: React.FC = () => {
  const loader = useLoader()
  const openLoader = async () => {
    await loader(async () => {}, {
      success: 'Good loader :)',
      loading: 'Testing ...',
      failed: 'Bad loader :(',
    })
  }

  const openScanner = useRedirectTo(ScreenNames.Interactions)

  return (
    <ScreenContainer>
      <Header size={HeaderSizes.large}>Claims</Header>
      <AttributesWidget
        containerComponent={ContainerComponent}
        attributes={attributes}
      />
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
    </ScreenContainer>
  )
}

export default Claims
