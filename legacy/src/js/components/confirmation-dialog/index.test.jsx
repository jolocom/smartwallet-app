/* global describe: true, it: true */
import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import ConfirmationDialog from './'

describe('(Component) ConfirmationDialog', function() {
  it('should render properly if opened', function() {
    const wrapper = shallow(
      (<ConfirmationDialog.WrappedComponent {
        ...ConfirmationDialog.mapStateToProps(Immutable.fromJS({
          confirm: {
            open: true,
            message: 'test msg',
            primaryActionText: 'Primary Action Text',
            callback: null
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Dialog').prop('open')).to.be.true
  })

  it('should not render if closed', function() {
    const wrapper = shallow(
      (<ConfirmationDialog.WrappedComponent {
        ...ConfirmationDialog.mapStateToProps(Immutable.fromJS({
          confirm: {
            open: false,
            message: 'test msg',
            primaryActionText: 'Primary Action Text',
            callback: null
          }
        }))
      } />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Dialog').prop('open')).to.be.false
  })

  it('should call close() on cancel', function() {
    let closed = false
    const close = () => { closed = true }

    const wrapper = shallow(
      (<ConfirmationDialog.WrappedComponent confirm={{
        open: true,
        message: 'test msg',
        primaryActionText: 'Primary Action Text',
        callback: null
      }} closeConfirmDialog={close} />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Dialog').prop('open')).to.be.true
    wrapper.find('Dialog').prop('actions')[0].props.onTouchTap()
    expect(closed).to.be.true
  })

  it('should call the callback and close() on cancel', function() {
    let closed = false
    let calledBack = false
    const close = () => { closed = true }
    const callback = () => { calledBack = true }

    const wrapper = shallow(
      (<ConfirmationDialog.WrappedComponent confirm={{
        open: true,
        message: 'test msg',
        primaryActionText: 'Primary Action Text',
        callback: callback
      }} closeConfirmDialog={close} />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('Dialog').prop('open')).to.be.true
    wrapper.find('Dialog').prop('actions')[1].props.onTouchTap()
    expect(closed).to.be.true
    expect(calledBack).to.be.true
  })
})
