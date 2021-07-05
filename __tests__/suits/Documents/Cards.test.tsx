import * as navigation from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import DocumentCard from '~/components/Card/DocumentCard'
import OtherCard from '~/components/Card/OtherCard'
import { getCredentialUIType } from '~/hooks/signedCredentials/utils'
import { IdentificationTypes } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

const HIGHLIGHT = 'ABC123'
const IMAGE = 'data:abc'
const FIELDS = [
  {
    id: 1,
    type: 'document',
    details: {
      mandatoryFields: [
        { label: 'givenName', value: 'Test Given Name' },
        { label: 'Document Name', value: 'some doc' },
      ],
      optionalFields: [{ label: 'c', value: 'd' }],
    },
  },
  {
    id: 2,
    type: 'other',
    details: {
      mandatoryFields: [{ label: 'givenName', value: 'f' }],
      optionalFields: [{ label: 'g', value: 'h' }],
    },
  },
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
  // TODO: fix me
  xtest('documents with image and highlight ', () => {
    const { getByText, getByTestId, queryByText } = renderWithSafeArea(
      <DocumentCard
        id={'test-1'}
        type="test"
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        photo={IMAGE}
        highlight={HIGHLIGHT}
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
        id={'test-1'}
        type="test"
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
      />,
    )

    expect(queryByTestId(testIds.photo)).toBe(null)
    expect(queryByTestId(testIds.highlight)).toBe(null)
  })

  test('navigates to the popup screen', () => {
    const { getByTestId } = renderWithSafeArea(
      <DocumentCard
        type="test"
        id={'test-1'}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
        photo={IMAGE}
        highlight={HIGHLIGHT}
      />,
    )
    const navigationSpy = jest.spyOn(navigation.useNavigation(), 'navigate')

    const dots = getByTestId(testIds.more)
    fireEvent.press(dots)

    expect(navigationSpy).toHaveBeenCalledWith(
      ScreenNames.TransparentModals,
      expect.objectContaining({ screen: ScreenNames.PopupMenu }),
    )
  })
})

describe('Other card is displaying passed props', () => {
  test('no logo', () => {
    const mockType = IdentificationTypes.ProofOfDriverLicenceDemo
    const { queryByTestId, getByText } = renderWithSafeArea(
      <OtherCard
        id={'test-1'}
        type={mockType}
        mandatoryFields={mandatoryFields}
        optionalFields={optionalFields}
      />,
    )

    expect(queryByTestId(testIds.logo)).toBeNull()
    expect(getByText(getCredentialUIType(mockType))).toBeDefined()
  })
})
