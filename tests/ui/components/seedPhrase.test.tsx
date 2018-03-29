import * as React from 'react'
import { SeedPhrase } from 'src/ui/registration/components/seedPhrase'

const ShallowRenderer = require('react-test-renderer/shallow')
const configureStore = require('redux-mock-store')
const { ThemeProvider } = require ('react-native-material-ui')

describe('seedPhrase component', ()=> {
  it('matches the snapshot with checkbox unchecked', () => {
    const renderer = new ShallowRenderer()
    const props = {
      seedPhrase: 'mock seedPhrase',
      checked: false,
      onCheck: () => null
    }
    const rendered = renderer.render(<SeedPhrase {...props}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with checkbox checked', () => {
    const renderer = new ShallowRenderer()
    const props = {
      seedPhrase: 'mock seedPhrase',
      checked: true,
      onCheck: () => null
    }
    const rendered = renderer.render(<SeedPhrase {...props}/>)
    expect(rendered).toMatchSnapshot()
  })
})
