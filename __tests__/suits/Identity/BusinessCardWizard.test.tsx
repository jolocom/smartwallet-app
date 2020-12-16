import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import BusinessCardWizard from '~/components/Wizard/BusinessCardWizard'
import { strings } from '~/translations'
import { AttributeTypes } from '~/types/credentials'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

const mockCreateAttr = jest.fn()

jest.mock('../../../src/hooks/attributes.ts', () => ({
  useCreateAttributes: jest.fn().mockImplementation(() => {
    return mockCreateAttr.mockResolvedValue(true)
  }),
}))

test('Can create a business card credential', () => {
  const { getByText, getAllByTestId } = renderWithSafeArea(
    <BusinessCardWizard onFormSubmit={jest.fn} />,
  )

  expect(getByText(strings.INTRODUCE_YOURSELF)).toBeDefined()

  // Step 1
  const inputs0 = getAllByTestId('core-input')

  expect(inputs0.length).toBe(2)
  expect(inputs0[0].props.placeholder).toBe('Given name')
  expect(inputs0[1].props.placeholder).toBe('Family name')

  fireEvent.changeText(inputs0[0], 'Alice')
  expect(inputs0[0].props.value).toBe('Alice')

  fireEvent.changeText(inputs0[1], 'Coltrane')
  expect(inputs0[1].props.value).toBe('Coltrane')

  const nextBtn0 = getByText(strings.NEXT)
  fireEvent.press(nextBtn0)

  // Step 2
  const inputs1 = getAllByTestId('core-input')

  expect(inputs1.length).toBe(2)
  expect(inputs1[0].props.placeholder).toBe('Email')
  expect(inputs1[1].props.placeholder).toBe('Number')

  fireEvent.changeText(inputs1[0], 'alice@example.com')
  expect(inputs1[0].props.value).toBe('alice@example.com')

  fireEvent.changeText(inputs1[1], '123456')
  expect(inputs1[1].props.value).toBe('123456')

  const nextBtn1 = getByText(strings.NEXT)
  fireEvent.press(nextBtn1)

  // Step 3
  const inputs2 = getAllByTestId('core-input')

  expect(inputs2.length).toBe(1)
  expect(inputs2[0].props.placeholder).toBe('Company name')

  fireEvent.changeText(inputs2[0], 'Jolocom')
  expect(inputs2[0].props.value).toBe('Jolocom')

  const nextBtn2 = getByText(strings.DONE)
  fireEvent.press(nextBtn2)

  expect(mockCreateAttr).toHaveBeenCalledTimes(1)
  expect(mockCreateAttr).toHaveBeenCalledWith(AttributeTypes.businessCard, {
    givenName: 'Alice',
    familyName: 'Coltrane',
    email: 'alice@example.com',
    telephone: '123456',
    legalCompanyName: 'Jolocom',
  })
})
