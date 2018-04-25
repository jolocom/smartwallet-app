import React from 'react'
import { shallow } from 'enzyme'
import App from 'src/App'
import mockCamera from './__mocks__/react-native-camera'

it('matches the snapshot', () => {
  jest.mock('react-native-camera', () => mockCamera)

  const rendered = shallow(<App />)
  expect(rendered).toMatchSnapshot()
})
