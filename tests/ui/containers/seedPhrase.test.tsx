import React from 'react'
import { SeedPhraseContainer } from 'src/ui/recovery/container/seedPhrase'
import { shallow } from 'enzyme'
import { createMockNavigationScreenProp } from 'tests/utils'

describe('seedPhrase container', () => {
  it('mounts correctly and matches snapshot', () => {
    const finishRegistration = jest.fn()

    const props: SeedPhraseContainer['props'] = {
      finishRegistration,
      navigation: createMockNavigationScreenProp({
        state: {
          params: {
            mnemonic: 'mock seedPhrase',
          },
        },
      }),
    }

    const rendered = shallow(<SeedPhraseContainer {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
