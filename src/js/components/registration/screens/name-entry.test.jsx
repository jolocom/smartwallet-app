import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import RegistrationNameEntryScreen from './name-entry'

describe('(Component) RegistrationNameEntryScreen', function() {
  it('should render properly the first time', function() {
    const setUsername = stub()
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        setUsername={setUsername}
        checkUsername={() => {}}
     />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('NameEntry').prop('value')).to.be.empty
    expect(wrapper.find('NameEntry').prop('errorMsg')).to.be.empty
  })
  it('should call config and show on handleDialog', function() {
    const showSimpleDialog = stub()
    const configSimpleDialog = stub()
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        showSimpleDialog={showSimpleDialog}
        configSimpleDialog={configSimpleDialog}
    />), { context: { muiTheme: { } } }
    )
    wrapper.find('NameEntry').prop('handleDialog')(null, 'whoo')
    expect(configSimpleDialog.calledWithArgs).to.deep.equal(
      [null, 'whoo', 'OK',
        {
          actionsContainerStyle: {
            textAlign: 'center'
          },
          contentStyle: {
            textAlign: 'center'
          }
        }]
    )
    expect(showSimpleDialog.called).to.be.true
  })
  it('should call setUsername onChange', function() {
    const setUsername = stub()
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        setUsername={setUsername}
        checkUsername={() => {}}
     />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('NameEntry').prop('onChange')('test')
    expect(setUsername.called).to.be.true
  })
  it('should call checkUsername onSubmit with proper params', function() {
    const checkUsername = stub()
    const wrapper = shallow(
      (<RegistrationNameEntryScreen.WrappedComponent {
        ...RegistrationNameEntryScreen.mapStateToProps(Immutable.fromJS({
          registration: {
            username: {
              value: '',
              valid: false,
              errorMsg: ''
            }
          }
        }))
      }
        setUsername={() => {}}
        checkUsername={checkUsername}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('NameEntry').prop('onSubmit')()
    expect(checkUsername.called).to.be.true
    expect(checkUsername.calls).to.deep.equal([{'args': []}])
  })
})
