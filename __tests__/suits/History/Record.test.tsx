import React from 'react'
import { useHistory } from '~/hooks/history'
import { FlowType } from '@jolocom/sdk'
import { IRecordStatus } from '~/types/records'
import { useTabs } from '~/components/Tabs/Tabs'
import { waitFor, render, act, fireEvent } from '@testing-library/react-native'
import Record from '~/screens/LoggedIn/History/Record'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import RecordItemsList from '~/screens/LoggedIn/History/RecordItemsList'
import History from '~/screens/LoggedIn/History'

jest.mock('../../../src/hooks/history', () => ({
  useHistory: () => ({
    getInteractions: jest.fn().mockResolvedValue([
      { id: 'test-offer', section: 'Today', type: 'CredentialOffer' },
      { id: 'test-auth', section: 'Yesterday', type: 'Authentication' },
      { id: 'test-share', section: 'Yesterday', type: 'CredentialShare' },
    ]),
    getInteractionDetails: jest.fn().mockImplementation(async (id: string) => {
      return {
        issuer: { did: 'did: test' },
        status: 'finished',
        steps: [
          { title: 'Test Step 1', description: '...' },
          { title: 'Test Step 2', description: '...' },
        ],
        time: '00:00',
        //NOTE: using id as the title for convenience
        title: id,
      }
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
    const { getByTestId, getAllByTestId, debug } = await waitFor(() =>
      renderWithSafeArea(<History />),
    )
    /*
     *     const { getByTestId, getAllByTestId, debug } = renderWithSafeArea(
     *       <History />,
     *     ) */

    debug()

    const item = getAllByTestId('record-item')[0]
    act(() => fireEvent(item, 'press'))

    expect(getByTestId('record-item-details')).toBeDefined()
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
