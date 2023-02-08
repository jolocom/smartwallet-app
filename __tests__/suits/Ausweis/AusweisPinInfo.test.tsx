import React from 'react'
import { AusweisPinInfo } from '~/screens/Modals/Interaction/eID/components'
import { mockSelectorReturn } from '../../mocks/libs/react-redux'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'

jest.mock('@react-navigation/native')
jest.mock('../../../src/hooks/navigation')

describe('Ausweis passcode details screen', () => {
  afterAll(() => {
    jest.useFakeTimers()
  })

  test('is displayed according to the designs', () => {
    mockSelectorReturn({
      toasts: {
        active: null,
      },
      interaction: {
        ausweis: {
          scannerKey: null,
        },
        deeplinkConfig: {
          redirectUrl: 'https://jolocom.io/',
        },
      },
    })

    const { toJSON } = renderWithSafeArea(<AusweisPinInfo />)
    expect(toJSON()).toMatchSnapshot()
  })
})
