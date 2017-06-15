import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import VerificationDataScreen from './data'
import Presentation from '../presentation/data'

describe('(Component) VerificationDataScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<VerificationDataScreen.WrappedComponent {
        ...VerificationDataScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            data: {
              focusedGroup: '',
              focusedField: '',
              idCard: {
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        save={() => {}}
        retrieveDataInformation={() => {}}
        changeDataField={() => {}}
        initiate={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find(Presentation).prop('loaded')).to.be.true
  })
  it('should call cancel with proper params', () => {
    const cancel = stub()
    const wrapper = shallow(
      (<VerificationDataScreen.WrappedComponent {
        ...VerificationDataScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            data: {
              focusedGroup: '',
              focusedField: '',
              idCard: {
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        changeDataField={() => {}}
        initiateCountrySelectScreen={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={() => {}}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        verifyData={() => {}}
        cancel={cancel}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().cancel()
    expect(cancel.called).to.be.true
    expect(cancel.calls).to.deep.equal([{args: []}])
  })
  it('should call setFocusedField with proper params', () => {
    const setFocusedField = stub()
    const wrapper = shallow(
      (<VerificationDataScreen.WrappedComponent {
        ...VerificationDataScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            data: {
              focusedGroup: '',
              focusedField: '',
              idCard: {
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        changeDataField={() => {}}
        initiateCountrySelectScreen={() => {}}
        changePhysicalAddressField={() => {}}
        setFocusedField={setFocusedField}
        setShowAddress={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        verifyData={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().setFocused('country', 'place')
    expect(setFocusedField.called).to.be.true
    expect(setFocusedField.calls).to.deep.equal([{args: ['country', 'place']}])
  })
  it('should call setShowAddress with proper params on change streetWithNumber', () => { // eslint-disable-line max-len
    const setShowAddress = stub()
    const wrapper = shallow(
      (<VerificationDataScreen.WrappedComponent {
        ...VerificationDataScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            data: {
              focusedGroup: '',
              focusedField: '',
              idCard: {
                number: {value: '', valid: false},
                expirationDate: {value: '', valid: false},
                firstName: {value: '', valid: false},
                lastName: {value: '', valid: false},
                gender: {value: '', valid: false, options: []},
                birthDate: {value: '', valid: false},
                birthPlace: {value: '', valid: false},
                birthCountry: {value: '', valid: false, options: []},
                showAddress: false,
                physicalAddress: {
                  streetWithNumber: {value: '', valid: false},
                  zip: {value: '', valid: false},
                  city: {value: '', valid: false},
                  state: {value: '', valid: false},
                  country: {value: '', valid: false, options: []}
                }
              }
            }
          }
        }))
      }
        changeDataField={() => {}}
        initiateCountrySelectScreen={() => {}}
        changePhysicalAddressField={() => {}}
        setShowAddress={setShowAddress}
        setFocusedField={() => {}}
        showSimpleDialog={() => {}}
        configSimpleDialog={() => {}}
        verifyData={() => {}}
        cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().change('streetWithNumber', 'test2')
    expect(setShowAddress.called).to.be.true
    expect(setShowAddress.calls)
      .to.deep.equal([{args: [true]}])
  })
})
