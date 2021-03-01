import React, { useMemo, useState } from 'react';
import { ResponsiveCardContext } from './context';
import { IResponsiveCardComposition } from './types';
import { Container, CredentialHighlight, CredentialImage } from './components';

const ResponsiveCard: React.FC & IResponsiveCardComposition = ({ children }) => {
  /* used for scaling down image */
  const [scaleRatio, setScaleRation] = useState(1);

  const contextValue = useMemo(() => ({
    scaleRatio,
    setScaleRation
  }), [scaleRatio])

  return (
    <ResponsiveCardContext.Provider value={contextValue} children={children}  />
  )
}

ResponsiveCard.Container = Container;
ResponsiveCard.Image = CredentialImage
ResponsiveCard.Highlight = CredentialHighlight

export default ResponsiveCard;