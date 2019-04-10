import React from 'react'
import { shallow } from 'enzyme'
import { TextInputField } from 'src/ui/home/components/textInputField'

describe('TextInputField component', () => {
  it('matches the snapshot on render', () => {
    const props = {
      handleFieldInput: () => {},
      fieldValue: 'test@test.com',
      fieldName: 'Email'
    }

    const rendered = shallow(<TextInputField {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
