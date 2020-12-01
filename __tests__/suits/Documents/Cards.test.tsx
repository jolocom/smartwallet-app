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
}

jest.mock('../../../src/components/Tabs/Tabs', () => ({
  ...jest.requireActual('../../../src/components/Tabs/Tabs'),
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
