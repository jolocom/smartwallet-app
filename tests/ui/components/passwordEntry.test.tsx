import React from 'react'
import { PasswordEntryComponent } from 'src/ui/registration/components/passwordEntry'
import { shallow } from 'enzyme'

describe('passwordEntry component', () => {
  const COMMON_PROPS = {
    onPasswordChange: () => null,
    onPasswordConfirmChange: () => null,
    clickNext: () => null,
  }

  it('matches the snapshot when no input is present', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      keyboardDrawn: false,
      password: '',
      confirmPassword: '',
    })

    const rendered = shallow(<PasswordEntryComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot when keyboard is drawn', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      keyboardDrawn: true,
      password: '',
      confirmPassword: '',
    })

    const rendered = shallow(<PasswordEntryComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot when passwords are not valid', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      keyboardDrawn: true,
      password: 'nodigitanduppercase',
      confirmPassword: '',
    })

    const rendered = shallow(<PasswordEntryComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })

  it('matches the snapshot when passwords are valid', () => {
    const props = Object.assign({}, COMMON_PROPS, {
      keyboardDrawn: true,
      password: 'ValidPass1',
      confirmPassword: 'ValidPass1',
    })

    const rendered = shallow(<PasswordEntryComponent {...props} />)
    expect(rendered).toMatchSnapshot()
  })
})
