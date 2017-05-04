import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
import EmailConfirmationScreen from './email-confirmation'
import {stub} from '../../../../../test/utils'

describe('(Component) EmailConfirmationScreen', function() {
  it('should call confirm upon load', function() {
    const confirm = stub()
    shallow(
      (<EmailConfirmationScreen.WrappedComponent id="test" visible
        {...EmailConfirmationScreen.mapStateToProps(Immutable.fromJS({
          emailConfirmation: {
            loading: true,
            success: false
          }
        }))}
        confirm={confirm}
        onClick={() => {}}
        />)
    )

    expect(confirm.calls).to.deep.equal([
      {args: [undefined]}])
  })
})
