import React, { createContext, useCallback, useMemo, useState } from 'react';
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
export const BodyFieldsCalculator: React.FC<IBodyFieldsCalculatorProps> = ({ maxFields, children }) => {
  const [lines, setLines] = useState<Record<number, number>>({});

  const handleTextLayout = useCallback((e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length;
    setLines(prevState => ({ ...prevState, [idx]: prevState[idx] ?? lines }))
  }, [setLines])

  const contextValue = useMemo(() => ({
    onTextLayout: handleTextLayout,
    // TODO: slice based on max fields
    lines,
  }), [JSON.stringify(lines), handleTextLayout]);

  return (
    <FieldsCalculatorContext.Provider
      value={contextValue}
      children={children}
    />)
}