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
        configDialog={() => {}}
        showDialog={() => {}}
     />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('NameEntry').prop('value')).to.be.empty
    expect(wrapper.find('NameEntry').prop('errorMsg')).to.be.empty
  })
  it('should call config and show on handleDialog', function() {
    const showDialog = stub()
    const configMsg = stub()
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
        showDialog={showDialog}
        configMsg={configMsg}
    />), { context: { muiTheme: { } } }
    )
    wrapper.find('NameEntry').prop('handleDialog')(null, 'whoo')
    expect(configMsg.calledWithArgs).to.deep.equal(
      [null, 'whoo', 'OK']
    )
    expect(showDialog.called).to.be.true
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
        configMsg={() => {}}
        showDialog={() => {}}
     />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('NameEntry').prop('onChange')('test')
    expect(setUsername.called).to.be.true
  })
  it('should call checkUsername onSubmit with proper params', function() {
    const checkCredentials = stub()
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
        checkCredentials={checkCredentials}
        configMsg={() => {}}
        showDialog={() => {}}
       />),
      { context: { muiTheme: { } } }
    )
    wrapper.find('NameEntry').prop('onSubmit')()
    expect(checkCredentials.called).to.be.true
    expect(checkCredentials.calls).to.deep.equal([{'args': []}])
  })
})
