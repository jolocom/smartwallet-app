import { paymentActions } from 'src/actions/'
import configureStore from 'redux-mock-store'
import data from '../registration/data/mockRegistrationData'
import thunk from 'redux-thunk'
import { JolocomLib } from 'jolocom-lib'
import { jolocomEthTransactionConnector } from 'jolocom-lib/js/ethereum/transactionConnector'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import * as helper from 'jolocom-lib/js/utils/helper'

describe('Payment action creators', () => {
  const { identityWallet } = data
  const initialState = {
    payment: {
      activePaymentRequest: {
        requestJWT: '',
        transactionDetails: {
          receiverAddress: '',
          amountInEther: ''
        },
        description: '',
        didRequester: ''
      }
    }
  }

  let mockStore = configureStore([thunk])(initialState)
  
  beforeEach(() => {
    mockStore.clearActions()
  })

  it('Should correctly consume payment request', async () => {
    const mockMiddleware = { identityWallet }

    const asyncAction = paymentActions
      .consumePaymentRequest(JolocomLib.parse.interactionToken.fromJSON(data.paymentRequestTokenJSON))
    await asyncAction(mockStore.dispatch, mockStore.getState, mockMiddleware)

    expect(mockStore.getActions()).toMatchSnapshot()
    expect(mockMiddleware.identityWallet.validateJWT).toHaveBeenCalledTimes(1)

  })

  it('Should correctly handle payment response creation', async () => {
    // TODO: better handling for state transitions
    const newState = {
      payment: {
        activePaymentRequest: {
          requestJWT: 'tardg.kuzesfgzudar.zstfd',
          transactionDetails: {
            receiverAddress: '',
            amountInEther: ''
          },
          description: '',
          didRequester: ''
        }
      }
    }

    mockStore = configureStore([thunk])(newState)
    const mockMiddleware = {
      identityWallet,
      keyChainLib: {
        getPassword: jest.fn().mockResolvedValue(data.getPasswordResult)
      },
      encryptionLib: {
        encryptWithPass: jest.fn().mockReturnValue(data.cipher),
        decryptWithPass: jest.fn().mockReturnValue(data.entropy)
      },
      storageLib: {
        get: {
          encryptedSeed: jest.fn().mockResolvedValue('johnnycryptoseed')
        }
      },
    }
    const requestToken = JSONWebToken.fromJSON(data.paymentRequestTokenJSON)
    JolocomLib.parse.interactionToken.fromJWT = jest.fn().mockReturnValue(requestToken)

    const spyPublicKeyToAddress = jest
      .spyOn(helper, 'publicKeyToAddress' )
      .mockReturnValue('ethAddressMock')

    const spyJoloEthTransConnectorCreate = jest
      .spyOn(jolocomEthTransactionConnector, 'createTransaction')
      .mockResolvedValue({
        value: 'amountInEther',
        sign: jest.fn().mockReturnValue('signed transaction'),
        serialize: jest.fn().mockReturnValue('serialized signed transaction')
      })

    const spyJoloEthTransConnectorSend = jest
      .spyOn(jolocomEthTransactionConnector, 'sendSignedTransaction')
      .mockResolvedValue({hash: 'transactionHash'})
    
    const asyncAction = paymentActions.sendPaymentResponse()
    await asyncAction(mockStore.dispatch, mockStore.getState, mockMiddleware)
   
    expect(mockStore.getActions()).toMatchSnapshot()
    expect(spyPublicKeyToAddress).toHaveBeenCalledTimes(1)
    expect(spyJoloEthTransConnectorCreate).toHaveBeenCalledTimes(1)
    expect(spyJoloEthTransConnectorSend).toHaveBeenCalledTimes(1)
    expect(mockMiddleware.identityWallet.validateJWT).toHaveBeenCalledTimes(1)
  })
})
