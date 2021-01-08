import React from 'react'
import { useSelector } from 'react-redux'
import { fireEvent } from '@testing-library/react-native'
import Identity from '~/screens/LoggedIn/Identity'
import { strings } from '~/translations'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock(
  '../../../node_modules/react-native/Libraries/LayoutAnimation/LayoutAnimation.js',
)

jest.mock('../../../src/hooks/attributes.ts', () => ({
  useCreateAttributes: jest.fn().mockImplementation(() => {
    return jest.fn().mockResolvedValue(true)
  }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

const testWizardPresence = (btnLabel: string, wizardTestId: string) => {
  const { getByText, getByTestId } = renderWithSafeArea(<Identity />)
  const btn = getByText(btnLabel)
  fireEvent.press(btn)
  expect(getByTestId(wizardTestId)).toBeDefined()
}

test('Intro sheet is present when there are no self issued credentials', () => {
  useSelector.mockImplementation(() => ({}))
  const { getByText, queryByTestId } = renderWithSafeArea(<Identity />)

  expect(getByText(strings.BUSINESS_CARD)).not.toBe(null)
  expect(getByText(strings.SINGLE_CREDENTIAL)).not.toBe(null)
  expect(queryByTestId('identity-credentials-present')).toBe(null)
})

test('Intro screen is not present when there are no self issued credentials', () => {
  useSelector.mockImplementation(() => ({ ProofOfNameCredential: {} }))

  const { getByTestId, queryByText } = renderWithSafeArea(<Identity />)

  expect(queryByText(strings.BUSINESS_CARD)).toBe(null)
  expect(queryByText(strings.SINGLE_CREDENTIAL)).toBe(null)
  expect(getByTestId('identity-credentials-present')).toBeDefined()
})

test('User should be able to access Business card Wizard form', () => {
  useSelector.mockImplementation(() => ({}))
  testWizardPresence(strings.BUSINESS_CARD, 'business-card-wizard')
})

test('User should be able to access Business card Wizard form', () => {
  useSelector.mockImplementation(() => ({}))
  testWizardPresence(strings.SINGLE_CREDENTIAL, 'single-credential-wizard')
})
