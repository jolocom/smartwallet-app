import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import Documents from '~/screens/LoggedIn/Documents'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { Colors } from '~/utils/colors'

const mockedDocuments = {
  documents: [
    {
      id: 'abscbajhfjdhfjdshfsdjhfa',
      type: 'document',
      claim: {
        id: 'id1',
        message: 'message1',
      },
      metadata: {
        name: 'Document 1',
      },
      issuer: {
        did: 'did:jun:example',
      },
    },
    {
      id: 'dsfjsjdfjhdfasjdhfasdhjfajsdhf',
      type: 'document 2',
      claim: {
        id: 'id2',
        message: 'message2',
      },
      metadata: {
        name: 'Document 2',
      },
      issuer: {
        did: 'did:jun:example',
        publicProfile: {
          name: 'Issuer name',
          description: 'I am the issuer',
        },
      },
    },
  ],
  other: [
    {
      id: 'adfdjfahdfahdfajsdhf dfye',
      type: 'other',
      claim: {
        id: 'id3',
        message: 'message3',
      },
      metadata: {
        name: 'Document 3',
      },
      issuer: {
        did: 'did:jun:example',
        publicProfile: {
          name: 'Issuer name',
          description: 'I am the issuer',
        },
      },
    },
  ],
}

const getColorValue = (styles: Array<Record<string, any>>) => {
  const value = styles.find((stylesEl) => !!stylesEl.color)
  return value?.color
}

jest.mock('../../../src/hooks/toasts', () => ({
  useToasts: jest.fn().mockImplementation(() => ({
    scheduleWarning: jest.fn(),
  })),
}))

jest.mock('../../../src/hooks/credentials', () => ({
  useDeleteCredential: () => jest.fn(),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockImplementation(() => mockedDocuments),
}))

test('Document Tabs', () => {
  const { getByText, getByTestId } = renderWithSafeArea(<Documents />)

  const documentsTab = getByText('Documents')
  const otherTab = getByText('Other')
  const documentCardsContainer = getByTestId('document-cards-container')
  const otherCardsContainer = getByTestId('other-cards-container')

  expect(documentsTab).toBeDefined()
  expect(otherTab).toBeDefined()

  fireEvent.press(documentsTab)

  expect(getColorValue(documentsTab.props.style)).toBe(Colors.white85)
  expect(getColorValue(otherTab.props.style)).toBe(Colors.white35)
  expect(documentCardsContainer.props.style.display).toBe('flex')
  expect(otherCardsContainer.props.style.display).toBe('none')

  fireEvent.press(otherTab)
  expect(getColorValue(documentsTab.props.style)).toBe(Colors.white35)
  expect(getColorValue(otherTab.props.style)).toBe(Colors.white85)
  expect(documentCardsContainer.props.style.display).toBe('none')
  expect(otherCardsContainer.props.style.display).toBe('flex')
})
