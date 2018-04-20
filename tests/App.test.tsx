import React from 'react'
import { shallow } from 'enzyme'
import App from 'src/App'

it('matches the snapshot', () => {
  const rendered = shallow(<App />)
  expect(rendered).toMatchSnapshot()
})
