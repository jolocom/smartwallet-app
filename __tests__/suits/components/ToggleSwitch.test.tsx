import React from 'react'
import { render, fireEvent, act } from '@testing-library/react-native'

import ToggleSwitch from '~/components/ToggleSwitch'

const TOGGLE_SWITCH_ID = 'toggleSwitch'

describe('ToggleSwitch', () => {
  it('should render the switch with disabled initial state', () => {
    const { toJSON } = render(
      <ToggleSwitch initialState={false} onToggle={jest.fn()} />,
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the switch with enabled initial state', () => {
    const { toJSON } = render(
      <ToggleSwitch initialState={true} onToggle={jest.fn()} />,
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('should fire the onToggle funtion when toggling ON', async () => {
    const mockFn = jest.fn()
    const { findByTestId } = render(
      <ToggleSwitch initialState={false} onToggle={mockFn} />,
    )

    const component = await findByTestId(TOGGLE_SWITCH_ID)
    fireEvent(component, 'pressIn')

    expect(mockFn).toHaveBeenCalledWith(true)
  })

  it('should fire the onToggle funtion when toggling OFF', async () => {
    const mockFn = jest.fn()
    const { findByTestId } = render(
      <ToggleSwitch initialState={true} onToggle={mockFn} />,
    )

    const component = await findByTestId(TOGGLE_SWITCH_ID)
    fireEvent(component, 'pressIn')

    expect(mockFn).toHaveBeenCalledWith(false)
  })
})
