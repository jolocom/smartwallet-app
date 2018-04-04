import * as React from 'react'
import App from 'src/App'

it('matches the snapshot', () => {
  const rendered = shallow(<App />)
  expect(rendered).toMatchSnapshot()
})
