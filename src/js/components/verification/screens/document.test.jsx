import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import VerificationDocumentScreen from './document'
import Presentation from '../presentation/document'

describe('(Component) VerificationDocumentScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<VerificationDocumentScreen.WrappedComponent {
        ...VerificationDocumentScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            document: {
              type: 'idCard'
            }
          }
        }))
      }
        chooseDocument={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find(Presentation).prop('type')).to.equal('idCard')
  })
  it('should call chooseDocument with proper params', () => {
    const chooseDocument = stub()
    const wrapper = shallow(
      (<VerificationDocumentScreen.WrappedComponent {
        ...VerificationDocumentScreen.mapStateToProps(Immutable.fromJS({
          verification: {
            document: {
              type: 'idCard'
            }
          }
        }))
      }
        chooseDocument={chooseDocument}
      />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().chooseDocument('idCard')
    expect(chooseDocument.called).to.be.true
    expect(chooseDocument.calls).to.deep.equal([{args: ['idCard']}])
  })
})
