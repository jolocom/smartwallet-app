import React from 'react'
import { shallow } from 'enzyme'
import { ExceptionComponent } from 'src/ui/generic/exception'
import { StyleSheet } from 'react-native'

describe('Exception screen component', () => {
  it('Renders correctly', () => {
    const props = {
      navigation: {
        state: {
          params: {
            flag: 'default',
          },
        },
      },
    }

    const rendered = shallow(<ExceptionComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('Renders correctly when no error object is provided', () => {
    const props = {
      navigation: {
        state: {
          params: {
            errorMessage: '',
            stackTrace: undefined,
          },
        },
      },
    }

    const rendered = shallow(<ExceptionComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
