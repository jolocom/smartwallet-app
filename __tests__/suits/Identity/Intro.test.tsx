import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'
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

test('Intro screen is present', () => {
  const { getByText } = renderWithSafeArea(<Identity />)

  const businessCardBtn = getByText(strings.BUSINESS_CARD)
  const singleCredentialBtn = getByText(strings.SINGLE_CREDENTIAL)
  expect(businessCardBtn).toBeDefined()
  expect(singleCredentialBtn).toBeDefined()
})

test('Credential wizards are displayed', async () => {
  const { getByText, debug } = renderWithSafeArea(<Identity />)
  const businessCardBtn = getByText(strings.BUSINESS_CARD)
  fireEvent.press(businessCardBtn)

  expect(getByText(strings.INTRODUCE_YOURSELF)).toBeDefined()

  const nextBtn0 = getByText(strings.NEXT)
  fireEvent.press(nextBtn0)

  const nextBtn1 = getByText(strings.NEXT)
  fireEvent.press(nextBtn1)

  const doneBtn = getByText(strings.DONE)
  fireEvent.press(doneBtn)

  await waitFor(() => getByText(strings.IT_IS_TIME_TO_CREATE))

  expect(getByText(strings.SINGLE_CREDENTIAL)).toBeDefined()
  const singleCredentialBtn = getByText(strings.SINGLE_CREDENTIAL)

  fireEvent.press(singleCredentialBtn)

  expect(getByText(strings.WHAT_IS_YOUR_NAME)).toBeDefined()

  const createBtn = getByText(strings.CREATE)
  fireEvent.press(createBtn)

  await waitFor(() => {
    expect(getByText(strings.IT_IS_TIME_TO_CREATE)).toBeDefined()
  })
})
