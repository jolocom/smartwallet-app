import en from 'src/locales/en.json'
import strings from '../../src/locales/strings'

describe('Terms', () => {
  it('should test if terms are in sync', () => {
    try {
      expect(Object.keys(en).sort()).toEqual(
        Object.keys(strings)
          .map(key => strings[key])
          .sort(),
      )
    } catch (e) {
      console.error('Please run "yarn terms" to synchronise the terms')
      throw e
    }
  })
})
