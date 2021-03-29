import React from 'react'

import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import IdentityBusinessCard from '~/screens/LoggedIn/Identity/IdentityBusinessCard'
import { strings } from '~/translations'
import { fireEvent, getQueriesForElement } from '@testing-library/react-native'

const mockedNavigate = jest.fn()
const mockedCreateSignedCredentialFn = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}))

jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => ({
    idw: {
      create: {
        signedCredential: mockedCreateSignedCredentialFn,
      },
    },
    passwordStore: {
      getPassword: jest.fn().mockResolvedValue(true),
    },
    storage: {
      store: {
        verifiableCredential: jest.fn().mockResolvedValue(true),
      },
    },
  }),
}))

describe('Business card is in state', () => {
  test('placeholder', () => {
    const { getByText, getAllByText, getByTestId } = renderWithSafeArea(
      <IdentityBusinessCard />,
    )
    expect(getByText(strings.YOUR_INFO_IS_QUITE_EMPTY)).toBeDefined()
    expect(getByTestId('business-card-placeholder')).toBeDefined()

    expect(getByText(strings.YOUR_NAME)).toBeDefined()
    expect(getByText(strings.COMPANY)).toBeDefined()
    expect(getByText(strings.CONTACT_ME)).toBeDefined()
    expect(getAllByText(strings.NOT_SPECIFIED).length).toBe(2)

    // ASSERT POPUP
    const dots = getByTestId('card-action-more')
    fireEvent.press(dots)

    const popup = getByTestId('popup-menu')
    expect(popup).toBeDefined()

    const popupQueries = getQueriesForElement(popup)
    expect(popupQueries.getAllByTestId('popup-menu-button').length).toBe(2)
  })
})
