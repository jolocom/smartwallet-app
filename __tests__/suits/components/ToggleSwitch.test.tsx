import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

import ToggleSwitch from '~/components/ToggleSwitch'

const TOGGLE_SWITCH_ID = 'toggleSwitch'

describe('ToggleSwitch', () => {
  it('should render the switch with disabled initial state', () => {
    const { toJSON } = render(<ToggleSwitch on={false} onToggle={jest.fn()} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the switch with enabled initial state', () => {
    const { toJSON } = render(<ToggleSwitch on={true} onToggle={jest.fn()} />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('is controlled and should call passed onToggle fn', async () => {
    const mockFn = jest.fn()
    const { findByTestId } = render(
      <ToggleSwitch on={true} onToggle={mockFn} />,
    )

    const component = await findByTestId(TOGGLE_SWITCH_ID)
    fireEvent(component, 'pressIn')

    // expect(mockFn).toHaveBeenCalledWith(false)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
