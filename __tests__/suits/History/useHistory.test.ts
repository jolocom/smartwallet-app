import { useHistory } from '~/hooks/history'

jest.mock('../../../src/hooks/sdk', () => ({
  useAgent: () => {
    const substractFromDate = (n: number) =>
      new Date().setDate(new Date().getDate() - n)
    const todayDate = Date.now()
    const yesterdayDate = substractFromDate(1)

    return {
      interactionManager: {
        getInteraction: jest.fn(),
        listInteractions: jest.fn().mockResolvedValue([
          {
            id: 'yesterday-record',
            lastMessage: {
              issued: yesterdayDate,
            },
            flow: {
              type: 'CredentialOffer',
            },
          },
          {
            id: 'today-record',
            lastMessage: {
              issued: todayDate,
            },
            flow: {
              type: 'CredentialShare',
            },
          },
        ]),
      },
    }
  },
}))

describe('useHistory Hook', () => {
  it('should group the records by date', async () => {
    const { getInteractions } = useHistory()

    //NOTE: arbitrary arguments
    const grouped = await getInteractions(2, 0)
    const today = grouped.find((r) => r.id === 'today-record')
    const yesterday = grouped.find((r) => r.id === 'yesterday-record')

    expect(today?.section).toBe('Dates.today')
    expect(yesterday?.section).toBe('Dates.yesterday')
  })
})
