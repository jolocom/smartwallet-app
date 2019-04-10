import React from 'react'
import { PasswordEntryContainer } from 'src/ui/registration/containers/passwordEntry'
import { shallow } from 'enzyme'

describe('passwordEntry container', ()=> {
  it('mounts correctly and matches snapshot', () => {
    const props = { savePassword: () => null }
    const rendered = shallow(<PasswordEntryContainer {...props}/>)
  })

  it('registers and removes keyboard listeners', () => {
    const props = { savePassword: () => null }
    const registerEvents = jest.spyOn(PasswordEntryContainer.prototype, 'setupListeners')
    const deregisterEvents = jest.spyOn(PasswordEntryContainer.prototype, 'removeListeners')

    const rendered = shallow(<PasswordEntryContainer {...props}/>)
    expect(registerEvents).toHaveBeenCalledTimes(1)
    expect(deregisterEvents).not.toHaveBeenCalled()

    rendered.unmount()
    expect(deregisterEvents).toHaveBeenCalledTimes(1)
  })
})
