import * as React from 'react'
import thunk from 'redux-thunk'
import { Entropy } from 'src/ui/registration/containers/entropy'
import { EntropyAgent } from 'src/agents/entropyAgent'
''
const configureStore = require('redux-mock-store')
const ShallowRenderer = require('react-test-renderer/shallow')
const { ThemeProvider } = require ('react-native-material-ui')

describe('Entropy container', ()=> {
  it('matches the snapshot', () => {
    const renderer = new ShallowRenderer()
    const middlewares = [ thunk ]
    const mockStore = configureStore(middlewares)

    const props = {
      submitEncodedEntropy: (entropy: string) => null,
      store: mockStore(),
      entropyAgent: new EntropyAgent(),
      isDrawn: false,
      sufficientEntropy: false
    }

    const rendered = renderer.render(
      <ThemeProvider uiTheme={{}}>
        <Entropy {...props}/>
      </ThemeProvider>,
    )
    expect(rendered).toMatchSnapshot()
  })
})
