import React from 'react'
import { shallow } from 'enzyme'
import { createMockNavigationScreenProp } from 'tests/utils'
import { RepeatSeedPhraseContainer } from '../../../src/ui/recovery/container/repeatSeedPhrase'

const mockSeedPhrase = 'mock seed Phrase of at least six words or more'
describe('repeatedPhrase container', () => {
  const setSeedPhraseSaved = jest.fn()
  const props: RepeatSeedPhraseContainer['props'] = {
    openSeedPhrase: jest.fn(),
    setSeedPhraseSaved,
    navigation: createMockNavigationScreenProp({
      state: {
        params: {
          mnemonic: mockSeedPhrase,
        },
      },
    }),
  }

  it('mounts correctly and matches snapshot', () => {
    RepeatSeedPhraseContainer.prototype.getRandomWords = jest.fn(() =>
      mockSeedPhrase.split(' ').slice(0, 6),
    )
    const rendered = shallow(<RepeatSeedPhraseContainer {...props} />)
    expect(rendered).toMatchSnapshot()
  })
  describe('component methods', () => {
    let instance: any
    let wrapper: any
    beforeEach(() => {
      RepeatSeedPhraseContainer.prototype.getRandomWords = jest.fn(() =>
        mockSeedPhrase.split(' ').slice(0, 6),
      )
      const rendered = shallow(<RepeatSeedPhraseContainer {...props} />)
      instance = rendered.instance()
      wrapper = rendered
      setSeedPhraseSaved.mockClear()
    })

    it('should selectPosition correctly', () => {
      expect(wrapper.state('sorting')).toEqual({})
      expect(wrapper.state('randomWords')).toContain('mock')
      instance.selectPosition(1)
      expect(wrapper.state('sorting')).toEqual({ 1: 'mock' })
      expect(wrapper.state('randomWords')).not.toContain('mock')
    })

    it('should correctly validate Mnemonic', () => {
      wrapper.setState({
        sorting: {
          0: 'mock',
          1: 'seed',
          2: 'Phrase',
          3: 'of',
          4: 'at',
          5: 'least',
        },
      })
      instance.checkMnemonic()
      expect(setSeedPhraseSaved).toBeCalled()
    })
    it('should not validate wrong sorting', () => {
      wrapper.setState({
        sorting: {
          0: 'seed',
          1: 'Phrase',
          2: 'at',
          3: 'mock',
          4: 'of',
          5: 'least',
        },
      })
      instance.checkMnemonic()
      expect(setSeedPhraseSaved).not.toBeCalled()
      expect(wrapper.state('sorting')).toEqual({})
      expect(wrapper.state('randomWords').length).toEqual(6)
    })
  })
})
