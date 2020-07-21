import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useLoader } from '~/hooks/useLoader'
import AttributesWidget from '~/components/AttributesWidget'
import { useSelectAttribute } from '~/hooks/useSelectAttributes'
import { useSelector } from 'react-redux'
import { getAttributes } from '~/modules/attributes/selectors'

// NOTE: you can test with this attributes as well to see the missing field
// - you would have to comment line 38 though to test values below
// const attributes = {
//   name: ['Sveta Buben', 'sbub'],
//   email: ['sveta@jolocom.com'],
//   number: [],
// }

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

  const attributes = useSelector(getAttributes)
  const { attrs, handleAttrSelect } = useSelectAttribute({
    isSelectable: true,
    attributes,
  })

  const openScanner = useRedirectTo(ScreenNames.Interactions)

  return (
    <ScreenContainer>
      <ContainerComponent>
        <AttributesWidget
          attributes={attrs}
          onAttrSelect={handleAttrSelect}
          onCreateNewAttr={(sectionKey) =>
            console.log('Creating new attr for', sectionKey)
          }
          isSelectable={true}
        />
      </ContainerComponent>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
    </ScreenContainer>
  )
}

export default Claims
