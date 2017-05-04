import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
import EmailConfirmationScreen from './email-confirmation'
import {stub} from '../../../../../test/utils'

describe.only('(Component) EmailConfirmationScreen', function() {
  it('should call confirm upon load', function() {
    const confirm = stub()
    const wrapper = shallow(
      (<EmailConfirmationScreen.WrappedComponent id="test" visible
        {...EmailConfirmationScreen.mapStateToProps(Immutable.fromJS({
          emailConfirmation: {
            loading: true,
            success: false
          }
        }))}
        location={{query: {
          email: 'test@test.com',
          code: '1e3t5'
        }}}
        confirm={confirm}
        goToLogin={() => {}}
        />)
    )
    wrapper.instance().componentDidMount()

    expect(confirm.calls).to.deep.equal([
      {args: [{
        email: 'test@test.com',
        code: '1e3t5'
      }]}
    ])
  })
})
