import React, { Children, useCallback, useMemo, useState } from 'react';
import { TextLayoutEvent } from '~/components/Card/Field';
import {
  IBodyFieldsCalculatorComposition,
  IBodyFieldsCalculatorProps
} from './types';
import {FieldsCalculatorContext} from './context'
import { FieldValue } from '../card/reusable';

export const BodyFieldsCalculator: React.FC<IBodyFieldsCalculatorProps> & IBodyFieldsCalculatorComposition = ({
  children,
  cbChildVisibility
}) => {
  const [lines, setLines] = useState<Record<number, number>>({});

  /* This will be invoked on FieldValue to calculate
    number of value lines
  */
  const handleTextLayout = useCallback((e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length;
    setLines(prevState => ({ ...prevState, [idx]: prevState[idx] ?? lines }))
  }, [setLines])
  
  /* We can't display all the fields that a service provides,
     therefore running a callback which decides what child to
     display and which one to cut off
  */
  const childrenToDisplay = Children.map(children, (child, idx) => {
    return cbChildVisibility(child, idx, lines);
  })

  const contextValue = useMemo(() => ({
    onTextLayout: handleTextLayout,
    lines,
  }), [JSON.stringify(lines), handleTextLayout]);

  return (
    <FieldsCalculatorContext.Provider
      value={contextValue}
      children={childrenToDisplay}
    />)
}

BodyFieldsCalculator.FieldValue = FieldValue;