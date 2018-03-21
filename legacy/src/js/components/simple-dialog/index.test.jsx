/* global describe: true, it: true */
import React from 'react'
import * as Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import {stub} from '../../../../test/utils'
import SimpleDialog from './'

describe('(Component) SimpleDialog', function() {
  it('should render properly', function() {
    const hideSimpleDialog = stub()
    const wrapper = shallow(
      (<SimpleDialog.WrappedComponent {
        ...SimpleDialog.mapStateToProps(Immutable.fromJS({
          simpleDialog: {
            visible: false,
            title: 'Test',
            message: 'Message'
          }
        })
      )} hideSimpleDialog={hideSimpleDialog} />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find('Dialog').prop('open')).to.equal(false)
  })
})
