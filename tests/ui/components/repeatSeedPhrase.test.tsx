import React from 'react'
import { shallow } from 'enzyme'
import RepeatSeedPhraseComponent from '../../../src/ui/recovery/components/repeatSeedPhrase'

describe('repeatSeedPhrase component', () => {
  const makeProps = (otherProps: {}) => ({
    note: 'some note to let the user know what to do',
    mnemonicSorting: {},
    randomWords: ['Mock', 'Seed', 'Phrase'],
    back: jest.fn(),
    checkMnemonic: jest.fn(),
    selectPosition: jest.fn(),
    ...otherProps,
  })

  it('matches the snapshot without sorting', () => {
    const props = makeProps({})
    const rendered = shallow(<RepeatSeedPhraseComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with sorting', () => {
    const props = makeProps({
      mnemonicSorting: { 1: 'Mock', 3: 'Seed', 9: 'Phrase' },
      randomWords: [],
    })
    const rendered = shallow(<RepeatSeedPhraseComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
