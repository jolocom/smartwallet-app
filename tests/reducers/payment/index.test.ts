import { paymentReducer } from 'src/reducers/payment'
import { paymentActions as actions } from 'src/actions/'

describe('payment reducer', ()=> {
  it('should initialize correctly', () => {
    expect(paymentReducer(undefined, { type: '@INIT' })).toMatchSnapshot()
  })

  it('should handle the SET_PAYMENT_REQUEST action ', () => {
    expect(paymentReducer(undefined, actions.setPaymentRequest({
      transactionDetails: {
        receiverAddress: 'ethereumAddress',
        amountInEther: '0.1'
      },
      requestJWT: 'zfghik.zfghj.rtdaftgz',
      description: 'This is a payment example',
      didRequester: 'did:jolo:test'
    })))
      .toMatchSnapshot()
  })

  it('should handle the CLEAR_PAYMENT_REQUEST action ', () => {
    expect(paymentReducer(undefined, actions.clearPaymentRequest()))
      .toMatchSnapshot()
  })
})
