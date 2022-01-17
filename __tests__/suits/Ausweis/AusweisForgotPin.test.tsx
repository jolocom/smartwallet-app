import React from 'react'
import {
  AusweisForgotPin,
  AUSWEIS_SUPPORT_EMAIL,
  AUSWEIS_SUPPORT_PHONE,
} from '~/screens/LoggedIn/eID/components/AusweisForgotPin'
import { useGoBack } from '~/hooks/navigation'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { fireEvent } from '@testing-library/react-native'

const mockOpenUrl = jest.fn()
jest.mock('../../../src/hooks/navigation')
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockOpenUrl,
}))

describe('Ausweis forgot pin', () => {
  beforeAll(() => {
    ;(useGoBack as jest.Mock).mockReturnValue(jest.fn)
  })
  afterEach(() => {
    mockOpenUrl.mockClear()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  test('is displayed according to the designs', () => {
    const { toJSON } = renderWithSafeArea(<AusweisForgotPin />)
    expect(toJSON()).toMatchSnapshot()
  })
  test('user is able to navigate to email app', () => {
    const { getByText } = renderWithSafeArea(<AusweisForgotPin />)
    const contactLink = getByText(AUSWEIS_SUPPORT_EMAIL)
    fireEvent.press(contactLink)
    expect(mockOpenUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenUrl).toHaveBeenCalledWith(`mailto:${AUSWEIS_SUPPORT_EMAIL}`)
  })
  test('user is able to navigate to telephone app', () => {
    const { getByText } = renderWithSafeArea(<AusweisForgotPin />)
    const phoneLink = getByText(new RegExp(AUSWEIS_SUPPORT_PHONE))
    fireEvent.press(phoneLink)
    expect(mockOpenUrl).toHaveBeenCalledTimes(1)
    expect(mockOpenUrl).toHaveBeenCalledWith(`tel:${AUSWEIS_SUPPORT_PHONE}`)
  })
})
