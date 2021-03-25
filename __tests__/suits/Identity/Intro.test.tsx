import React from 'react'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import IdentityIntro from '~/screens/LoggedIn/Identity/IdentityIntro'
import { getQueriesForElement } from '@testing-library/react-native'
import { strings } from '~/translations'

jest.useFakeTimers()
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

describe('Intro displays', () => {
  test('correct ui components initially', () => {
    const { getAllByTestId, getByText } = renderWithSafeArea(<IdentityIntro />)

    const wizardButtons = getAllByTestId('button')
    expect(wizardButtons.length).toBe(2)

    const { getByText: getSingleCredText } = getQueriesForElement(
      wizardButtons[0],
    )
    expect(getSingleCredText(strings.SINGLE_CREDENTIAL)).toBeDefined()

    const { getByText: getBusinessCredText } = getQueriesForElement(
      wizardButtons[1],
    )
    expect(getBusinessCredText(strings.BUSINESS_CARD)).toBeDefined()

    expect(getByText(strings.IT_IS_TIME_TO_CREATE)).toBeDefined()
  })
})
