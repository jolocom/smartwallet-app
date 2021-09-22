import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { View, Text, ScrollView } from 'react-native'
import { act } from '@testing-library/react-hooks'

import Collapsible from '~/components/Collapsible'
import {
  CHILDREN_TEXT,
  TITLE1,
  TITLE2,
  HEADER_HIGHT,
  CollapsibleBuilder,
  mockMeasureLayout,
} from './collapsible-utils'

describe('Collapsible', () => {
  it('renders custom header and observers header title change with multiple titles', async () => {
    /**
     * mocking measure layout which is being invoked
     * on layout of collapsible title, to make sure
     * title is being added to the title[] in collapsible
     * index state
     */
    // title 1
    mockMeasureLayout(100, 100, 100, 100)
    // title 2
    mockMeasureLayout(200, 200, 200, 200)

    const collapsibleSetup = new CollapsibleBuilder()
      .renderHeader(({ currentTitleText }) => (
        <View style={{ height: HEADER_HIGHT }}>
          <Text testID="collapsible-custom-header-text">
            {currentTitleText}
          </Text>
        </View>
      ))
      .build()
    const { getByTestId, getAllByTestId, getByText } = render(
      <Collapsible {...collapsibleSetup}>
        <Text>{CHILDREN_TEXT}</Text>
      </Collapsible>,
    )

    /**
     * TODO: should be abstracted, reused in credentialform.test.ts
     */
    const headerContainer = getByTestId('collapsible-header-container')
    act(() => {
      fireEvent(headerContainer, 'onLayout', {
        nativeEvent: {
          layout: {
            height: 100,
          },
        },
      })
    })

    await waitFor(() => {
      expect(getByTestId('collapsible-scroll')).toBeDefined()
    })

    /**
     * triggering title on layout event
     */
    const titleEls = getAllByTestId('collapsible-title')
    act(() => {
      fireEvent(titleEls[0], 'onLayout')
      fireEvent(titleEls[1], 'onLayout')
    })

    const scrollEl = getByTestId('collapsible-scroll')
    act(() => {
      fireEvent.scroll(scrollEl, {
        nativeEvent: {
          contentOffset: {
            y: 60,
          },
        },
      })
    })

    expect(scrollEl.props.contentContainerStyle[0].paddingTop).toBe(
      HEADER_HIGHT,
    )
    const headerText = getByTestId('collapsible-custom-header-text')
    expect(headerText).toBeDefined()
    expect(headerText.props.children).toBe(TITLE1)
    expect(getByText(CHILDREN_TEXT)).toBeDefined()

    act(() => {
      fireEvent.scroll(scrollEl, {
        nativeEvent: {
          contentOffset: {
            y: 160,
          },
        },
      })
    })
    expect(headerText.props.children).toBe(TITLE2)
  })
})
