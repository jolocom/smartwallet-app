import * as React from 'react'
import { SeedPhraseContainer } from 'src/ui/registration/containers/seedPhrase'

const { ThemeProvider } = require ('react-native-material-ui')

describe('seedPhrase container', ()=> {
  it('mounts correctly and matches snapshot', () => {
    const fetchSeedPhrase = jest.fn()
    const clearSeedPhrase = jest.fn()

    const props = {
      fetchSeedPhrase,
      clearSeedPhrase,
      seedPhrase: 'mock seedPhrase'
    }

    const rendered = shallow(<SeedPhraseContainer {...props}/>)
    expect(rendered).toMatchSnapshot()

    rendered.unmount()
    expect(fetchSeedPhrase.mock.calls.length).toBe(1)
    expect(clearSeedPhrase.mock.calls.length).toBe(1)
  })
})
