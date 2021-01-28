import React from 'react'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import RecordItem from '~/screens/LoggedIn/History/components/RecordItem'
import { useHistory } from '~/hooks/history'
import { FlowType } from '@jolocom/sdk'
import { IRecordStatus } from '~/types/records'
import { waitFor } from '@testing-library/react-native'

jest.mock('../../../src/hooks/history', () => ({
  useHistory: jest.fn(),
}))

const mockHistory = ({ details = {}, interactions = {} }) => {
  //@ts-ignore
  useHistory.mockImplementation(() => ({
    getInteractionDetails: jest.fn().mockResolvedValueOnce(details),
    getInteractions: jest.fn().mockResolvedValueOnce(interactions),
  }))
}

const testAuthDetails = {
  type: FlowType.Authentication,
  title: 'Authentication',
  issuer: { did: 'did: test' },
  status: IRecordStatus.finished,
  steps: [
    { title: 'Test Step 1', description: '...' },
    { title: 'Test Step 2', description: '...' },
  ],
  time: '00:00',
}

describe('Record Item', () => {
  it('should render the placeholder when the details are unavailable', () => {
    mockHistory({})
    const props = { id: 'test', onDropdown: jest.fn(), isFocused: false }
    const { toJSON } = renderWithSafeArea(<RecordItem {...props} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render a generic Record Item', async () => {
    mockHistory({
      details: testAuthDetails,
    })
    const props = { id: 'test', onDropdown: jest.fn(), isFocused: false }
    const { toJSON } = await waitFor(() =>
      renderWithSafeArea(<RecordItem {...props} />),
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the dropdown with the FINISHED state', async () => {
    mockHistory({
      details: testAuthDetails,
    })
    const props = { id: 'test', onDropdown: jest.fn(), isFocused: true }
    const { toJSON } = await waitFor(() =>
      renderWithSafeArea(<RecordItem {...props} />),
    )

    expect(toJSON()).toMatchSnapshot()
  })
  it('should render the dropdown with the PENDING state', async () => {
    mockHistory({
      details: { ...testAuthDetails, status: IRecordStatus.pending },
    })
    const props = { id: 'test', onDropdown: jest.fn(), isFocused: true }
    const { toJSON } = await waitFor(() =>
      renderWithSafeArea(<RecordItem {...props} />),
    )

    expect(toJSON()).toMatchSnapshot()
  }),
    it('should render the dropdown with the EXPIRED state', async () => {
      mockHistory({
        details: { ...testAuthDetails, status: IRecordStatus.expired },
      })
      const props = { id: 'test', onDropdown: jest.fn(), isFocused: true }
      const { toJSON } = await waitFor(() =>
        renderWithSafeArea(<RecordItem {...props} />),
      )

      expect(toJSON()).toMatchSnapshot()
    })
})
