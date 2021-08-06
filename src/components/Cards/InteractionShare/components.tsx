import React from 'react'
import { FieldsCalculatorProps } from './types'

export const FieldsCalculator: React.FC<{
  cbFieldsVisibility: FieldsCalculatorProps
}> = ({ children, cbFieldsVisibility }) =>
  React.Children.map(children, cbFieldsVisibility) as React.ReactElement<
    unknown,
    string
  > | null
