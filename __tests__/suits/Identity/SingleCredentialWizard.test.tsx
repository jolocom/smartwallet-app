import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import SingleCredentialWizard from '~/components/Wizard/SingleCredentialWizard'
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
    <SingleCredentialWizard onFormSubmit={jest.fn} />,
  )

  expect(getByText(strings.WHAT_IS_YOUR_NAME)).toBeDefined()

  // Step 1
  const inputs0 = getAllByTestId('core-input')

  expect(inputs0.length).toBe(2)
  expect(inputs0[0].props.placeholder).toBe('Given name')
  expect(inputs0[1].props.placeholder).toBe('Family name')

  fireEvent.changeText(inputs0[0], 'Alice')
  expect(inputs0[0].props.value).toBe('Alice')

  fireEvent.changeText(inputs0[1], 'Coltrane')
  expect(inputs0[1].props.value).toBe('Coltrane')

  const nextBtn0 = getByText(strings.CREATE)
  fireEvent.press(nextBtn0)

  expect(mockCreateAttr).toHaveBeenCalledTimes(1)
  expect(mockCreateAttr).toHaveBeenCalledWith(AttributeTypes.name, {
    givenName: 'Alice',
    familyName: 'Coltrane',
  })
})
