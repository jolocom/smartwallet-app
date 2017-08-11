import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import Immutable from 'immutable'
import CountryVerificationScreen from './country'
import Presentation from '../presentation/country'
import {stub} from '../../../../../test/utils'

describe('(Component) CountryVerificationScreen', () => {
  it('should render properly the first time', () => {
    const setCountryValue = stub()
    const chooseCountry = stub()
    const wrapper = shallow((<CountryVerificationScreen.WrappedComponent {
      ...CountryVerificationScreen.mapStateToProps(Immutable.fromJS({
        verifier: {
          country: {
            value: '',
            options: [],
            type: ''
          }
        }
      }))}
      setCountryValue={setCountryValue}
      chooseCountry={chooseCountry}
      cancelCountrySelection={() => {}} />),
      { context: { muiTheme: {} } }
    )
    expect(wrapper.find(Presentation).prop('value')).to.be.empty
    expect(wrapper.find(Presentation).prop('countries')).to.deep.equal([])
  })
  it('should call setCountryValue and chooseCountry with proper params on submit', () => { // eslint-disable-line max-len
    const setCountryValue = stub()
    const chooseCountry = stub()
    const wrapper = shallow((<CountryVerificationScreen.WrappedComponent {
      ...CountryVerificationScreen.mapStateToProps(Immutable.fromJS({
        verifier: {
          country: {
            value: '',
            options: [],
            type: ''
          }
        }
      }))}
      setCountryValue={setCountryValue}
      chooseCountry={chooseCountry}
      cancelCountrySelection={() => {}} />),
      { context: { muiTheme: {} } }
    )
    wrapper.find(Presentation).props().submit('test')
    expect(setCountryValue.called).to.be.true
    expect(chooseCountry.called).to.be.true
    expect(chooseCountry.calls).to.deep.equal([{args: []}])
    expect(setCountryValue.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call setCountryValue with proper params on change', () => {
    const setCountryValue = stub()
    const wrapper = shallow((<CountryVerificationScreen.WrappedComponent{
      ...CountryVerificationScreen.mapStateToProps(Immutable.fromJS({
        verifier: {
          country: {
            value: '',
            options: [],
            type: ''
          }
        }
      }))}
      setCountryValue={setCountryValue}
      chooseCountry={() => {}}
      cancelCountrySelection={() => {}} />),
      { context: { muiTheme: {} } }
    )
    wrapper.find(Presentation).props().change('test')
    expect(setCountryValue.called).to.be.true
    expect(setCountryValue.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call cancelCountrySelection with proper params on cancel', () => {
    const cancelCountrySelection = stub()
    const wrapper = shallow((<CountryVerificationScreen.WrappedComponent{
      ...CountryVerificationScreen.mapStateToProps(Immutable.fromJS({
        verifier: {
          country: {
            value: '',
            options: [],
            type: ''
          }
        }
      }))}
      setCountryValue={() => {}}
      cancelCountrySelection={cancelCountrySelection}
      chooseCountry={() => {}} />),
      { context: { muiTheme: {} } }
    )
    wrapper.find(Presentation).props().cancel()
    expect(cancelCountrySelection.called).to.be.true
    expect(cancelCountrySelection.calls).to.deep.equal([{args: []}])
  })
})
