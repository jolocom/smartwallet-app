import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SingleSignOnAccessRightScreen from './access-right'
import Presentation from '../presentation/access-right'
import {stub} from '../../../../../test/utils'

describe.only('(Component) SingleSignOnAccessRightScreen', () => {
  it('should call retrieveConnectedServices to start', () => {
    const retrieveConnectedServices = stub()
    const wrapper = shallow((<SingleSignOnAccessRightScreen.WrappedComponent
      {...SingleSignOnAccessRightScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true,
            failed: false,
            serviceNumber: 0,
            services: []
          }
        }
      }))}
      deleteService={() => {}}
      showSharedData={() => {}}
      retrieveConnectedServices={retrieveConnectedServices}
      openConfirmDialog={() => {}}
      closeConfirmDialog={() => {}} />)
    )
    wrapper.instance()
    expect(retrieveConnectedServices.called).to.be.true
  })
  it('should call deleteService with proper params', () => {
    const openConfirmDialog = stub()
    const deleteService = stub()
    const wrapper = shallow((<SingleSignOnAccessRightScreen.WrappedComponent
      {...SingleSignOnAccessRightScreen.mapStateToProps(Immutable.fromJS({
        singleSignOn: {
          accessRight: {
            loaded: true,
            failed: false,
            serviceNumber: 0,
            services: []
          }
        }
      }))}
      deleteService={deleteService}
      showSharedData={() => {}}
      retrieveConnectedServices={() => {}}
      openConfirmDialog={openConfirmDialog}
      closeConfirmDialog={() => {}} />)
    )
    wrapper.find(Presentation).props().showDeleteServiceWindow({
      title: 'test title',
      message: 'test message',
      style: {},
      rightButtonLabel: 'test rightButtonLabel',
      leftButtonLabel: 'test leftButtonLabel',
      index: 0
    })
    expect(openConfirmDialog.called).to.be.true
    openConfirmDialog.calls[0].args[3]()
    expect(deleteService.called).to.be.true
    expect(openConfirmDialog.calls).to.deep.equal([{
      args: ['test title', 'test message', 'test rightButtonLabel',
        () => { deleteService() }, 'test leftButtonLabel', {}]
    }])
  })
})
