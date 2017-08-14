import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import WalletIdCardScreen from './id-card'
import Presentation from '../presentation/id-card'

describe('(Component) WalletIdCardScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<WalletIdCardScreen.WrappedComponent {
        ...WalletIdCardScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            idCard: {
              loaded: false,
              showErrors: false,
              focusedGroup: '',
              focusedField: '',
              idCard: {
                locations: [
                  {title: '', streetWithNumber: '', zip: '', city: ''}
                ],
                images: {
                  frontSideImg: {value: ''},
                  backSideImg: {value: ''}
                },
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
        retrieveIdCardInformation={() => {}}
        changeIdCardField={() => {}}
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

    expect(wrapper.find(Presentation).prop('loaded')).to.be.false
  })
})
