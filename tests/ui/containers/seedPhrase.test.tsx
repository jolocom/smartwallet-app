import React from 'react'
import { SeedPhraseContainer } from 'src/ui/registration/containers/seedPhrase'
import { shallow } from 'enzyme'

describe('seedPhrase container', () => {
  it('mounts correctly and matches snapshot', () => {
    const fetchSeedPhrase = jest.fn()
    const clearSeedPhrase = jest.fn()

    const props = {
      fetchSeedPhrase,
      clearSeedPhrase,
      navigation: {
        state: {
          params: {
            mnemonic: 'mock seedPhrase',
          },
        },
      },
    }

    const rendered = shallow(<SeedPhraseContainer {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
