import * as React from 'react'
import { SeedPhrase } from '../../src/ui/registration/containers/seedPhrase'
import thunk from 'redux-thunk'

const configureStore = require('redux-mock-store')
const ShallowRenderer = require('react-test-renderer/shallow')
const { ThemeProvider } = require ('react-native-material-ui')

describe('seedPhrase container', ()=> {
  it('matches the snapshot', () => {
    const renderer = new ShallowRenderer()
    const middlewares = [ thunk ]
    const mockStore = configureStore(middlewares)

    const props = {
      fetchSeedPhrase: () => null,
      clearSeedPhrase: () => null,
      store: mockStore(),
      seedPhrase: ''
    }

    const rendered = renderer.render(
      <ThemeProvider uiTheme={{}}>
        <SeedPhrase {...props}/>
      </ThemeProvider>,
    )
    expect(rendered).toMatchSnapshot()
  })
})
