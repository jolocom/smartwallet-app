import * as React from 'react'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'

const ShallowRenderer = require('react-test-renderer/shallow')
const configureStore = require('redux-mock-store')
const { ThemeProvider } = require ('react-native-material-ui')

describe('MaskedImage component', ()=> {
  it('matches the snapshot with checkbox unchecked', () => {
    const renderer = new ShallowRenderer()
    const props = {
      addPoint: (x: number, y: number) => null, 
      drawUpon: () => null 
    }
    const state = {
      uncoveredPath: ''
    }
    const rendered = renderer.render(<MaskedImageComponent {...props, state}/>)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot with checkbox checked', () => {
    const renderer = new ShallowRenderer()
    const props = {
      addPoint: (x: number, y: number) => null, 
      drawUpon: () => null 
    }
    const state = {
      uncoveredPath: ''
    }
    const rendered = renderer.render(<MaskedImageComponent {...props, state}/>)
    expect(rendered).toMatchSnapshot()
  })
})