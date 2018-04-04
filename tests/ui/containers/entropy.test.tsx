import * as React from 'react'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme'

import { Entropy } from 'src/ui/registration/containers/entropy'
import { EntropyAgent } from 'src/lib/entropyAgent'

const configureStore = require('redux-mock-store')
const { ThemeProvider } = require ('react-native-material-ui')

describe('Entropy container', ()=> {
  it('matches the snapshot', () => {
    const middlewares = [ thunk ]
    const mockStore = configureStore(middlewares)

    const props = {
      submitEncodedEntropy: (entropy: string) => null,
      store: mockStore(),
      entropyAgent: new EntropyAgent(),
      isDrawn: false,
      sufficientEntropy: false
    }

    const rendered = shallow(
      <ThemeProvider uiTheme={{}}>
        <Entropy {...props}/>
      </ThemeProvider>,
    )
    expect(rendered).toMatchSnapshot()
  })
})
