import * as React from 'react'
import App from '../App'

const ShallowRenderer = require('react-test-renderer/shallow')

it('matches the snapshot', () => {
  const renderer = new ShallowRenderer()
  const rendered = renderer.render(<App />)
  expect(rendered).toMatchSnapshot()
})
