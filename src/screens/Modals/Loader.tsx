import React from 'react';

import Paragraph from '~/components/Paragraph';
import ScreenContainer from '~/components/ScreenContainer';

const Loader: React.FC = () => {
  return (
    <ScreenContainer>
      <Paragraph>Creating your personal secret number</Paragraph>
    </ScreenContainer>
  );
};

export default Loader;
