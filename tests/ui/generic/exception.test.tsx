import React from 'react'
import { shallow } from 'enzyme'
import { Exception } from 'src/ui/generic/'
import { StyleSheet } from 'react-native'

describe('Exception screen component', () => {
  it('Renders correctly when error object is provided', () => {
    // const mockError = {
    //   message: 'MOCK BAD ERROR',
    //   stack: 'MOCK STACK TRACE'
    // }

    // const props = {
    //   navigation: {
    //     state: {
    //       params: {
            // errorMessage: mockError.message,
            // stackTrace: mockError.stack
    //       }
    //     }
    //   }
    // }

    // const rendered = shallow(<Exception {...props} />)
    // expect(rendered).toMatchSnapshot()
  })

  // it('Renders correctly when no error object is provided', () => {
  //   const props = {
  //     navigation: {
  //       state: {
  //         params: {
            // errorMessage: '',
            // stackTrace: undefined
  //         }
  //       }
  //     }
  //   }

  //   const rendered = shallow(<Exception {...props} />)
  //   expect(rendered).toMatchSnapshot()
  // })
})
