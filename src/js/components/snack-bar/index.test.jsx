/* global describe: true, it: true */
import React from 'react'
import * as Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import {stub} from '../../../../test/utils'
import SnackBar from './'

describe('(Component) SnackBar', function() {
  it('should render properly', function() {
    const callback = stub()
    const wrapper = shallow(
      (<SnackBar.WrappedComponent {
        ...SnackBar.mapStateToProps(Immutable.fromJS({
          snackBar: {
            open: true,
            message: 'test msg',
            undo: false,
            undoCallback: callback
          }
        })
      )} />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.prop('open')).to.be.true
    expect(wrapper.prop('message')).to.equal('test msg')
  })
})
