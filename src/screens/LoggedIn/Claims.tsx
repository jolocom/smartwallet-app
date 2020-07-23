import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useLoader } from '~/hooks/useLoader'

const Claims: React.FC = () => {
  const loader = useLoader()
  const openLoader = async () => {
    await loader(
      async () => {
        // throw new Error('test')
      },
      {
        success: 'Good loader',
        loading: 'Testing',
        failed: 'Bad loader',
      },
    )
  }

  const openScanner = useRedirectTo(ScreenNames.Interactions)

  return (
    <ScreenContainer>
      <Header size={HeaderSizes.large}>Claims</Header>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
    </ScreenContainer>
  )
}

export default Claims
