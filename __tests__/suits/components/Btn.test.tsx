import React from 'react'
import { render } from '@testing-library/react-native'

import Btn, { BtnTypes } from '~/components/Btn'

test('Btn component is displayed correctly', () => {
  const handlePress = () => {}
  const { getByTestId, rerender } = render(
    <Btn onPress={handlePress}>Hello</Btn>,
  )

  const Gradient = getByTestId('gradient')
  expect(Gradient).toBeDefined()

  rerender(
    <Btn type={BtnTypes.secondary} onPress={handlePress}>
      Hey
    </Btn>,
  )
  const NonGradientContainer = getByTestId('non-gradient')
  expect(NonGradientContainer).toBeDefined()
})
