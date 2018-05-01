import React from 'react'
import { shallow } from 'enzyme'
import { Exception } from 'src/ui/generic/exception'
import { StyleSheet } from 'react-native'

describe('Exception screen component', () => {
  it('Renders correctly when error object is provided', () => {
    const testError = new Error('failed to perform mock operation')
    const props = {
      navigation: {
        state: {
          params: {
            errorMessage: testError.message,
            stackTrace: testError.stack
          }
        }
      }
    }

    const rendered = shallow(<Exception {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('Renders correctly when no error object is provided', () => {
    const props = {
      navigation: {
        state: {
          params: {
            errorMessage: '',
            stackTrace: undefined
          }
        }
      }
    }

    const rendered = shallow(<Exception {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
