import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Presentation from '../presentation/country-select'
import CountrySelectScreen from './country-select'
import {stub} from '../../../../../test/utils'

describe('(Component) CountrySelectScreen', () => {
  const fake = () => {}
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<CountrySelectScreen.WrappedComponent id="test" visible
        {...CountrySelectScreen.mapStateToProps(Immutable.fromJS({wallet: {
          country: {
            type: '',
            value: 'test',
            options: []
          }
        }}))}
        setCountryValue={fake}
        submit={fake}
        cancel={fake} />)
    )
    expect(wrapper.find(Presentation).prop('value')).to.equal('test')
    expect(wrapper.find(Presentation).prop('countries')).to.deep.equal([])
  })
  it('should call submit and setCountryValue on submit', () => {
    const setCountryValue = stub()
    const submit = stub()
    const wrapper = shallow(
      (<CountrySelectScreen.WrappedComponent id="test" visible
        {...CountrySelectScreen.mapStateToProps(Immutable.fromJS({wallet: {
          country: {
            type: '',
            value: '',
            options: []
          }
        }}))}
        setCountryValue={setCountryValue}
        submit={submit}
        cancel={fake} />)
    )
    wrapper.find(Presentation).props().submit('test')
    expect(setCountryValue.called).to.be.true
    expect(setCountryValue.calls).to.deep.equal([{args: ['test']}])
    expect(submit.called).to.be.true
    expect(submit.calls).to.deep.equal([{args: []}])
  })
  it('should setCountryValue on change', () => {
    const setCountryValue = stub()
    const wrapper = shallow(
      (<CountrySelectScreen.WrappedComponent id="test" visible
        {...CountrySelectScreen.mapStateToProps(Immutable.fromJS({wallet: {
          country: {
            type: '',
            value: '',
            options: []
          }
        }}))}
        setCountryValue={setCountryValue}
        submit={fake}
        cancel={fake} />)
    )
    wrapper.find(Presentation).props().change('test')
    expect(setCountryValue.called).to.be.true
    expect(setCountryValue.calls).to.deep.equal([{args: ['test']}])
  })
  it('should call cancel with proper params', () => {
    const cancel = stub()
    const wrapper = shallow(
      (<CountrySelectScreen.WrappedComponent id="test" visible
        {...CountrySelectScreen.mapStateToProps(Immutable.fromJS({wallet: {
          country: {
            type: '',
            value: '',
            options: []
          }
        }}))}
        setCountryValue={fake}
        submit={fake}
        cancel={cancel} />)
    )
    wrapper.find(Presentation).props().cancel()
    expect(cancel.called).to.be.true
    expect(cancel.calls).to.deep.equal([{args: []}])
  })
})
