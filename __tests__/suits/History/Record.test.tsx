import React from 'react'
import { waitFor, act, fireEvent } from '@testing-library/react-native'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import History from '~/screens/LoggedIn/History'

jest.mock('../../../src/hooks/interactions/listeners', () => ({
  useInteractionUpdate: jest.fn(),
  useInteractionCreate: jest.fn(),
}))

jest.mock('../../../src/hooks/history', () => ({
  useHistory: () => ({
    getInteractions: jest.fn().mockResolvedValueOnce([
      { id: 'test-offer', section: 'Today', type: 'CredentialOffer' },
      { id: 'test-auth', section: 'Yesterday', type: 'Authentication' },
      { id: 'test-share', section: 'Yesterday', type: 'CredentialShare' },
    ]),
    assembleInteractionDetails: jest.fn().mockResolvedValueOnce({
      issuer: { did: 'did: test' },
      status: 'finished',
      steps: [
        { title: 'Test Step 1', description: '...' },
        { title: 'Test Step 2', description: '...' },
      ],
      time: '00:00',
      //NOTE: using id as the title for convenience
      title: 'Test',
    }),
  }),
}))

jest.mock('../../../src/hooks/toasts', () => ({
  useToasts: () => ({
    scheduleErrorWarning: jest.fn(),
  }),
}))

describe('Record', () => {
  it('should open the item details when pressed', async () => {
    const { getByTestId, getAllByTestId } = await waitFor(() =>
      renderWithSafeArea(<History />),
    )

    const item = getAllByTestId('record-item')[0]
    act(() => fireEvent(item, 'press'))

    expect(getByTestId('record-item-details')).toBeDefined()
  })

  it('should correctly format the time', async () => {
    const { getAllByTestId } = await waitFor(() =>
      renderWithSafeArea(<History />),
    )

    const item = getAllByTestId('record-item-time')[0]
    expect(item).toBeDefined()
  })

  //FIXME: @onViewableItemsChanged on @SectionList is never called
  it.skip('should update the section when scrolled', async () => {
    const { getByTestId, getAllByTestId } = await waitFor(() =>
      renderWithSafeArea(<History />),
    )
    const headers = getAllByTestId('record-header')
    console.log(headers.map((h) => h.children))

    const sectionList = getByTestId('record-list-all')

    const scrollEvent = {
      nativeEvent: {
        contentOffset: {
          y: 400,
        },
        contentSize: {
          // Dimensions of the scrollable content
          height: 500,
          width: 300,
        },
        layoutMeasurement: {
          // Dimensions of the device
          height: 600,
          width: 300,
        },
      },
    }
    await act(async () => fireEvent(sectionList, 'scroll', scrollEvent))

    const header = getByTestId('history-main-header')
    expect(header.children).toBe('Yesterday')
  })
})
