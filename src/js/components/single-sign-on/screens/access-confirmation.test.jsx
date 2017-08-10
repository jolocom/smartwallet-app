import React from 'react'
import Immutable from 'immutable'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import AccessConfirmationScreen from './access-confirmation'
import Presentation from '../presentation/access-confirmation'
// import {stub} from '../../../../../test/utils'

describe('(Component) AccessConfirmationScreen', () => {
  it('should pass entity as props correctly', () => {
    const wrapper = shallow((<AccessConfirmationScreen.WrappedComponent
      {...AccessConfirmationScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRequest: {
            entity: {
              loading: false,
              name: 'SOME COMPANY',
              image: 'img/logo.svg',
              requester: '',
              returnURL: '',
              fields: ['phone', 'email']
            }
          }
        }
      }))
    }
      entity={{}} />
    ))
    expect(wrapper.find(Presentation).props().entity).to.deep.equal({
      loading: false,
      name: 'SOME COMPANY',
      image: 'img/logo.svg',
      requester: '',
      returnURL: '',
      fields: ['phone', 'email']
    })
  })
})
