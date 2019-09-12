import { expect } from 'detox'
import jestExpect from 'expect'
import { readVisibleText } from 'e2e/utils'

describe('Identity Creation', () => {
  describe('Entropy Screen', () => {
    let entropyMsg: Detox.DetoxAny
    let progressRegexp = /(\d+) %/

    beforeAll(async () => {
      const getStarted = element(by.id('getStarted'))
      await getStarted.tap()
      entropyMsg = element(by.id('entropyMsg'))
    })

    it('should show an entropyMsg help text at first', async () => {
      await expect(entropyMsg).toBeVisible()
      const text = await readVisibleText('entropyMsg')
      jestExpect(text).not.toMatch(progressRegexp)
    })

    it('should show a percentage of entropy collected on swipe in scratchArea', async () => {
      const scratchArea = element(by.id('scratchArea'))
      await scratchArea.swipe('right', 'slow')
      const text = await readVisibleText('entropyMsg')
      jestExpect(text).toMatch(progressRegexp)

      const swipeDirs: Detox.Direction[] = ['up', 'down', 'left', 'right']
      for (let progress = 0; progress < 100; ) {
        const text = await readVisibleText('entropyMsg')
        const match = progressRegexp.exec(text)
        jestExpect(match).toHaveLength(2)
        progress = parseInt((match as Array<string>)[1])
        await scratchArea.swipe(swipeDirs[progress % 4], 'fast')
      }
    })
  })
})
