import React from 'react'
import { Text } from 'react-native'
// @ts-expect-error
import MockNativeMethods from 'react-native/jest/MockNativeMethods'

import Collapsible from '~/components/Collapsible'
import { ICollapsibleContext } from '~/components/Collapsible/types'

export const CHILDREN_TEXT = 'children'
export const HEADER_HIGHT = 100
export const TITLE1 = 'title1'
export const TITLE2 = 'title2'

type MeasureValues = [number, number, number, number] // x, y, width, height

export const mockMeasureLayout = (...values: MeasureValues) => {
  MockNativeMethods.measureLayout.mockImplementationOnce(
    (_: unknown, cb: (...values: MeasureValues) => void) => {
      cb(...values)
    },
  )
}

export class CollapsibleBuilder {
  private _collapsible: {
    renderHeader: (context: ICollapsibleContext) => JSX.Element
    renderScroll: (context: ICollapsibleContext) => JSX.Element
  }

  constructor() {
    this._collapsible = {
      renderHeader: this.renderHeaderDefault,
      renderScroll: this.renderScrollDefault,
    }
  }
  renderHeaderDefault(context: ICollapsibleContext) {
    return <Collapsible.Header />
  }

  renderScrollDefault(context: ICollapsibleContext) {
    return (
      <Collapsible.Scroll>
        <Collapsible.Title text={TITLE1}>
          <Text>{TITLE1}</Text>
        </Collapsible.Title>
        <Collapsible.Title text={TITLE2}>
          <Text>{TITLE2}</Text>
        </Collapsible.Title>
      </Collapsible.Scroll>
    )
  }

  renderHeader(implementation: (context: ICollapsibleContext) => JSX.Element) {
    this._collapsible.renderHeader = implementation
    return this
  }

  renderScroll(implementation: (context: ICollapsibleContext) => JSX.Element) {
    this._collapsible.renderScroll = implementation
    return this
  }

  build() {
    return this._collapsible
  }
}
