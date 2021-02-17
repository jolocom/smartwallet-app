import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import DocumentCard from '~/components/Card/DocumentCard'
import OtherCard from '~/components/Card/OtherCard'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

const HIGHLIGHT = 'ABC123'
const IMAGE = 'data:abc'
const FIELDS = [
  {
    id: 1,
    type: 'document',
    details: {
      mandatoryFields: [
        { name: 'givenName', value: 'b' },
        { name: 'Document Name', value: 'some doc' },
      ],
      optionalFields: [{ name: 'c', value: 'd' }],
    },
  },
  {
    id: 2,
    type: 'other',
    details: {
      mandatoryFields: [{ name: 'givenName', value: 'f' }],
      optionalFields: [{ name: 'g', value: 'h' }],
    },
  },
]
const CLAIMS = [
  {
    name: 'claim1',
    value: 'Claim 1',
  },
  { name: 'claim1', value: 'Claim 1' },
]

const testIds = {
  photo: 'card-photo',
  highlight: 'card-highlight',
  logo: 'card-logo',
  more: 'card-action-more',
  popupMenu: 'popup-menu',
}

const mockedNavigate = jest.fn()

jest.mock('../../../src/components/Tabs/context', () => ({
  useTabs: jest.fn().mockReturnValue({
    activeTab: { id: 'document', value: 'Documents' },
    setActiveTab: jest.fn(),
  }),
}))

jest.mock('../../../src/hooks/toasts', () => ({
  useToasts: jest.fn().mockImplementation(() => ({
    scheduleWarning: jest.fn(),
  })),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}))

jest.mock('../../../src/hooks/credentials', () => ({
  useDeleteCredential: () => jest.fn(),
}))

const [mandatoryFields] = FIELDS.map((f) => f.details.mandatoryFields)

const [optionalFields] = FIELDS.map((f) => f.details.optionalFields)

describe('Document card is displaying passed props', () => {
  test('documents with image and highlight ', () => {
    const { getByText, getByTestId, queryByText } = renderWithSafeArea(
      <DocumentCard
        id={1}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        image={IMAGE}
        highlight={HIGHLIGHT}
        claims={CLAIMS}
      />,
    )

    expect(getByText(HIGHLIGHT)).toBeDefined()
    expect(getByTestId(testIds.highlight)).toBeDefined()
    expect(getByTestId(testIds.photo)).toBeDefined()

    expect(getByTestId(testIds.more)).toBeDefined()
    // renders type documents
    expect(getByText('b')).toBeDefined()
    // doesn't render type other
    expect(queryByText('f')).toBe(null)
    expect(queryByText('Type of the document')).toBe(null)
  })

  test('without image and highlight', () => {
    const { queryByTestId } = renderWithSafeArea(
      <DocumentCard
        id={1}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        claims={CLAIMS}
      />,
    )

    expect(queryByTestId(testIds.photo)).toBe(null)
    expect(queryByTestId(testIds.highlight)).toBe(null)
  })

  test('can perform actions on a card', () => {
    const { getByTestId, getByText, debug } = renderWithSafeArea(
      <DocumentCard
        id={1}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        image={IMAGE}
        highlight={HIGHLIGHT}
        claims={CLAIMS}
      />,
    )

    const dots = getByTestId(testIds.more)
    fireEvent.press(dots)

    const popupMenu = getByTestId(testIds.popupMenu)

    expect(popupMenu.props.visible).toBe(true)

    const deleteBtn = getByText('Delete')

    fireEvent.press(deleteBtn)
    expect(mockedNavigate).toHaveBeenCalledTimes(1)
  })
})

describe('Other card is displaying passed props', () => {
  test('no logo', () => {
    const { queryByTestId, getByText } = renderWithSafeArea(
      <OtherCard
        id={1}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        claims={CLAIMS}
      />,
    )

    expect(queryByTestId(testIds.logo)).toBeNull()
    expect(getByText('Type of the document')).toBeDefined()
  })
})
