import React from 'react'
import { Dimensions } from 'react-native'
import { fireEvent, render } from '@testing-library/react-native'

import ScaledCard, {
  ScaledText,
  ScaledView,
} from '~/components/Cards/ScaledCard'
import {
  handleContainerLayout,
  scaleStyleObject,
} from '~/components/Cards/ScaledCard/utils'

jest.mock('react-native/Libraries/Utilities/Dimensions.js', () => ({
  get: jest.fn(),
}))
jest.mock('react-native/Libraries/Utilities/PixelRatio.js')
jest.mock('../../../../src/components/Cards/ScaledCard/utils.ts', () => ({
  ...jest.requireActual('../../../../src/components/Cards/ScaledCard/utils.ts'),
  handleContainerLayout: jest.fn(),
}))

const mockDeviceScreenWidth = 200

it('scales styles given scaleBy value', () => {
  const scaledStyles = scaleStyleObject(
    [{ width: 100 }, { paddingBottom: 100 }],
    0.5,
  )
  expect(scaledStyles.width).toBe(50)
  expect(scaledStyles.paddingBottom).toBe(50)
})

describe('ScaledCard', () => {
  // @ts-expect-error
  Dimensions.get.mockReturnValue({ width: mockDeviceScreenWidth })

  it('calculates scaled properties based on original screen width', () => {
    const { getByTestId } = render(
      <ScaledCard
        originalWidth={200}
        originalHeight={100}
        originalScreenWidth={400}
      >
        <ScaledView style={{ flex: 0.5 }} scaleStyle={{ width: 50 }} />
        <ScaledText scaleStyle={{ fontSize: 20 }} />
      </ScaledCard>,
    )
    const scaledview = getByTestId('scaled-View')
    const scaledtext = getByTestId('scaled-Text')
    expect(scaledview.props.style[0]).toEqual({ flex: 0.5 })
    expect(scaledview.props.style[1]).toEqual({ width: 25 })
    expect(scaledtext.props.style[1]).toEqual({ fontSize: 10 })
  })

  it('calculates scaled properties based on container width', () => {
    // @ts-expect-error
    handleContainerLayout.mockReturnValue({ width: 100, height: 50 })
    const { getByTestId } = render(
      <ScaledCard originalWidth={200} originalHeight={100} scaleToFit>
        <ScaledView style={{ flex: 0.5 }} scaleStyle={{ width: 50 }} />
        <ScaledText scaleStyle={{ fontSize: 20 }} />
      </ScaledCard>,
    )

    const scaledview = getByTestId('scaled-View')
    const scaledtext = getByTestId('scaled-Text')
    /**
     * values are not scaled because onlayout event wasn't
     * called and containerWidth is undefined, therefore,
     * it falls back to scaleBy 1
     */
    expect(scaledview.props.style[0]).toEqual({ flex: 0.5 })
    expect(scaledview.props.style[1]).toEqual({ width: 50 })
    expect(scaledtext.props.style[1]).toEqual({ fontSize: 20 })

    const container = getByTestId('scaled-container')
    fireEvent(container, 'layout')

    expect(handleContainerLayout).toBeCalledTimes(1)

    expect(scaledview.props.style[0]).toEqual({ flex: 0.5 })
    expect(scaledview.props.style[1]).toEqual({ width: 25 })
    expect(scaledtext.props.style[1]).toEqual({ fontSize: 10 })
  })
})
