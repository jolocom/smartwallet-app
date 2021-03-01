import React, { useMemo, useState } from 'react';
import { ResponsiveCardContext } from './context';
import { IResponsiveCardComposition } from './types';
import { Container, CredentialHighlight, CredentialHolderName, CredentialImage, FieldPlaceholder, FieldsCalculator, FieldValue } from './components';
import { TextLayoutEvent } from '~/components/Card/Field';

const ResponsiveCard: React.FC & IResponsiveCardComposition = ({ children }) => {
  /* used for scaling down image */
  const [scaleRatio, setScaleRation] = useState(1);
  const [holderNameLines, setHolderNameLines] = useState(0);
  const [fieldLines, setFieldLines] = useState<Record<number, number>>({});

  /* This will be invoked inside FieldValue component
    to calculate number of value lines
  */
  const handleFieldValutLayout = (e: TextLayoutEvent, idx: number) => {
    const lines = e.nativeEvent.lines.length;
    setFieldLines(prevState => ({ ...prevState, [idx]: prevState[idx] ?? lines }))
  }

  const contextValue = useMemo(() => ({
    scaleRatio,
    setScaleRation,
    holderNameLines,
    setHolderNameLines,
    fieldLines,
    onFieldValueLayout: handleFieldValutLayout
  }), [scaleRatio, holderNameLines, fieldLines])

  return (
    <ResponsiveCardContext.Provider value={contextValue} children={children}  />
  )
}

ResponsiveCard.Container = Container;
ResponsiveCard.Image = CredentialImage
ResponsiveCard.Highlight = CredentialHighlight
ResponsiveCard.HolderName = CredentialHolderName
ResponsiveCard.FieldsCalculator = FieldsCalculator
ResponsiveCard.FieldValue = FieldValue
ResponsiveCard.FieldPlaceholder = FieldPlaceholder

export default ResponsiveCard;