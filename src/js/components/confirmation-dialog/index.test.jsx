/* global describe: true, it: true */
import React from 'react'
import { Map } from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import reducer, { confirm } from 'redux/modules/confirmation-dialog'
import { ConfirmationDialog } from './'

const mockStore = configureMockStore([])

describe('(Component) ConfirmationDialog', function() {
  it('should render properly if opened', function() {
    console.log('!')
    const store = mockStore(new Map({confirm: reducer(
      reducer(undefined, '@INIT'),
      confirm({
        message: 'test msg',
        primaryActionText: 'Primary Action Text',
        callback: null
      })
    )}))
    console.log('!.5')
    console.log('!!', store.getState().toJS())
    const wrapper = shallow(<ConfirmationDialog store={store} />)
    console.log('!!!', wrapper.html())
    expect(wrapper.find('Dialog').prop('open')).to.be.true
  })
})
