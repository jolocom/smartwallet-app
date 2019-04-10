import { formatEth } from '../../src/utils/formatEth'

describe('Ether formatting helper function', () => {
  const testAmounts = {
    small: 1984,
    topWeiLimit: 999999,
    withinGweiLimit: 2849331,
    greaterThanGwei: 9281738291837261
  }

  it('formats up to 1e6 wei as wei', () => {
    const result = formatEth(testAmounts.small)
    expect(result).toMatchObject({
      formattedAmount: testAmounts.small,
      unit: 'WEI'
    })
    const result2 = formatEth(testAmounts.topWeiLimit)
    expect(result2).toMatchObject({
      formattedAmount: testAmounts.topWeiLimit,
      unit: 'WEI'
    })
  })

  it('formats amounts above 1e6 wei as GWEI', () => {
    const result = formatEth(testAmounts.withinGweiLimit)
    const formattedAmount = 0.002849331
    const expected = {
      formattedAmount,
      unit: 'GWEI'
    }
    expect(result).toMatchObject(expected)
  })

  it('formats amounts above 1e15 wei as ETH', () => {
    const result = formatEth(testAmounts.greaterThanGwei)
    const formattedAmount = 0.009281738291837261
    const expected = {
      formattedAmount,
      unit: 'ETH'
    }
    expect(result).toMatchObject(expected)
  })
})
