import React, { Children, createContext, useCallback, useMemo, useState } from 'react';
import { TextLayoutEvent } from '~/components/Card/Field';
import { useCustomContext } from '~/hooks/context';

interface IFieldsCalculatorContext {
  lines: Record<number, number>
  onTextLayout: (e: TextLayoutEvent, idx: number) => void
}

const FieldsCalculatorContext = createContext<IFieldsCalculatorContext | undefined>(undefined);
FieldsCalculatorContext.displayName = 'FieldsCalculatorContext';

export const useFieldCalculator = useCustomContext(FieldsCalculatorContext);

interface IBodyFieldsCalculatorProps {
  maxFields: number
}
export const BodyFieldsCalculator: React.FC<IBodyFieldsCalculatorProps> = ({ maxFields, children, hasHighlight, cbChildVisibility }) => {
  const [lines, setLines] = useState<Record<number, number>>({});

  const handleTextLayout = useCallback((e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length;
    setLines(prevState => ({ ...prevState, [idx]: prevState[idx] ?? lines }))
  }, [setLines])
  
  /* We can't display all the fields that service provides */
  const childrenToDisplay = Children.map(children, (child, idx) => {
    /* 1. Do not display anything that is more than max
      2. Do not display all the fields besides first if number of lines of the first field is more than 1 and there is a highlight
    */
    if (idx + 1 > maxFields || (lines[0] > 1 && hasHighlight && idx > 0)) {
      return null
    }
    return child;
  })

  const contextValue = useMemo(() => ({
    onTextLayout: handleTextLayout,
    // TODO: slice based on max fields
    lines,
  }), [JSON.stringify(lines), handleTextLayout]);

  return (
    <FieldsCalculatorContext.Provider
      value={contextValue}
      children={childrenToDisplay}
    />)
}