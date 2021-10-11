import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { renderWithSafeArea } from '../../utils/renderWithSafeArea'
import { Colors } from '~/utils/colors'
import Tabs from '~/components/Tabs/Tabs'
import TabsContainer from '~/components/Tabs/Container'
import { useTabs } from '~/components/Tabs/context'
import { View } from 'react-native'

const getColorValue = (styles: Array<Record<string, any>>) => {
  const value = styles.find((stylesEl) => !!stylesEl.color)
  return value?.color
}

const Panels = () => {
  const { activeTab } = useTabs()

  return (
    <>
      <View
        testID="firstId"
        style={{ display: activeTab?.id === 'first' ? 'flex' : 'none' }}
      />
      <View
        testID="secondId"
        style={{ display: activeTab?.id === 'second' ? 'flex' : 'none' }}
      />
    </>
  )
}

test('Document Tabs', () => {
  const tabs = [
    { id: 'first', value: 'First' },
    { id: 'second', value: 'Second' },
  ]

  const { getByText, getByTestId } = renderWithSafeArea(
    <Tabs tabs={tabs} initialActiveTab={tabs[0]}>
      <TabsContainer>
        {tabs.map((t) => (
          <Tabs.Tab key={t.id} tab={t} />
        ))}
      </TabsContainer>
      <Panels />
    </Tabs>,
  )

  const firstTab = getByText('First')
  const secondTab = getByText('Second')
  const firstContainer = getByTestId('firstId')
  const secondContainer = getByTestId('secondId')

  expect(firstTab).toBeDefined()
  expect(secondTab).toBeDefined()

  fireEvent.press(firstTab)

  expect(getColorValue(firstTab.props.style)).toBe(Colors.white85)
  expect(getColorValue(secondTab.props.style)).toBe(Colors.white35)
  expect(firstContainer.props.style.display).toBe('flex')
  expect(secondContainer.props.style.display).toBe('none')

  fireEvent.press(secondTab)
  expect(getColorValue(firstTab.props.style)).toBe(Colors.white35)
  expect(getColorValue(secondTab.props.style)).toBe(Colors.white85)
  expect(firstContainer.props.style.display).toBe('none')
  expect(secondContainer.props.style.display).toBe('flex')
})
